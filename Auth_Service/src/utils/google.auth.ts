const fs = require("fs").promises;
const path = require("path");
const process = require("process");

const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

import createHttpError from "http-errors";
import log from "./logger";

export interface calendarEvent {
  summary: string;
  description: string;

  startTime: Date;
  endTime: Date;

  otherAttendee: string;
}

export interface googleCalendarApiInterface {
  authorize(): Promise<JSON>;
  createClient(content): Promise<any>;
  createEvent(eventData: calendarEvent, authClient): Promise<string>;
}

class googleCalendarApi implements googleCalendarApiInterface {
  private SCOPES = ["https://www.googleapis.com/auth/calendar"];

  private TOKEN_PATH = path.join(process.cwd(), "token.json");
  private CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

  constructor() {}

  private async saveCredentials(client) {
    try {
      const content = await fs.readFile(this.CREDENTIALS_PATH);
      const keys = JSON.parse(content);
      const key = keys.installed || keys.web;
      const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
      });
      await fs.writeFile(this.TOKEN_PATH, payload);
    } catch (err) {
      log.error(err);
      throw createHttpError.InternalServerError("Error saving credentials");
    }
  }

  async createClient(credentials) {
    try {
      //const credentials = JSON.parse(content);
      const client = google.auth.fromJSON(credentials);
      return client;
    } catch (err) {
      return null;
    }
  }

  async authorize() {
    try {
      let client = await authenticate({
        scopes: this.SCOPES,
        keyfilePath: this.CREDENTIALS_PATH,
      });

      if (client.credentials) await this.saveCredentials(client);

      // read the content again to return it
      const newCredentials = await fs.readFile(this.TOKEN_PATH);
      return JSON.parse(newCredentials);
    } catch (err) {
      log.error(err);
      throw createHttpError.InternalServerError("Error authorizing");
    }
  }

  async createEvent(eventData: calendarEvent, authClient) {
    // construct event
    const event = {
      summary: eventData.summary,
      location: "Google Meet",
      description: eventData.description,

      start: {
        dateTime: eventData.startTime.toISOString(),
        timeZone: "Asia/Dhaka",
      },
      end: {
        dateTime: eventData.endTime.toISOString(),
        timeZone: "Asia/Dhaka",
      },

      attendees: [{ email: eventData.otherAttendee }],

      conferenceData: {
        createRequest: {
          requestId: "sample123",
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    try {
      const calendar = google.calendar({ version: "v3", auth: authClient });

      const response = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1,
      });

      console.log("conferenceData", response.data.conferenceData);

      const meetingLink = response.data.conferenceData.entryPoints[0].uri;

      console.log("meetingLink", meetingLink);

      return meetingLink;
    } catch (err) {
      log.error(err);
      throw createHttpError.InternalServerError("Error creating event");
    }
  }
}

export default new googleCalendarApi();
