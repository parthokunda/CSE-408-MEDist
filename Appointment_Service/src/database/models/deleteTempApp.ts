//external imports
import cron from "node-cron";
import { Op } from "sequelize";

// internal imports
import Appointment, { AppointmentStatus } from "./Appointment.model";
import log from "../../utils/logger";
import broker, { RPC_Request_Payload } from "../../utils/broker";
import { config } from "../../config";

// delete temporary appointments every 10 minutes
const deleteTempApp = cron.schedule("*/10 * * * *", async () => {
  //this means every 10 minutes
  try {
    const now = new Date();
    const stillTempApp = await Appointment.findAll({
      where: {
        status: AppointmentStatus.TEMPORARY,
        expires_at: {
          [Op.lte]: now,
        },
      },
    });

    if (stillTempApp) {
      for (const app of stillTempApp) {
        const timeSlotID = app.timeSlotID;
        const appID = app.id;

        // delete appointment
        await app.destroy();

        log.info(`Deleted temporary appointment with id ${appID}`);

        const payload: RPC_Request_Payload = {
          type: "DELETED_TEMP_APPOINTMENT",
          data: {
            appointmentID: appID,
            timeSlotID,
          },
        };
        await broker.PUBLISH_TO_EXCHANGE(
          config.TEMPORARAY_APPOINTMENT_DELETION_EXCHANGE,
          payload
        );
      }
    }
  } catch (error) {
    log.error(error, "Error in deleting temporary appointments");
  }
});

export default deleteTempApp;
