import React, { FC, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import DoctorDetailsCard from "./DoctorDetailsCard";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

import axios from "axios";
import { useCookies } from "react-cookie";

import { DoctorProfileInfo, SingleDaySchedule } from "@/models/DoctorSchema";
import { useMutation } from "@tanstack/react-query";
import {
  ConfirmAppointmentResponse,
  RejectAppointmentRespone,
  RequestAppointmentInfo,
} from "@/models/Appointment";
import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";

type inputObject = {
  authToken: string;
  scheduleId: number;
};

type confirmRejectObject = {
  authToken: string;
  appointmentId: number;
};

const getDate = (date: Date | undefined): string => {
  if (date === undefined) return "";
  date.getHours;
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  console.log(`${hours}:${minutes}:${seconds}`);
  return `${hours}:${minutes}:${seconds}`;
};

const onSubmit = async (
  authToken: string,
  scheduleId: number
): Promise<RequestAppointmentInfo> => {
  console.log(`sending request for scheduleid ${scheduleId}`);
  const response = await axios.post(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/appointment/book-online-appointment/${scheduleId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authToken}`, // Replace with your actual token
      },
    }
  );
  console.log(
    "🚀 ~ file: PatientBookAppointment.tsx:38 ~ onSubmit ~ response:",
    response.data
  );
  return response.data;
};

const sendConfirmation = async (
  authToken: string,
  appointmentId: number
): Promise<ConfirmAppointmentResponse> => {
  console.log("confirming app");
  const response = await axios.put(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/appointment/book-online-appointment/confirm/${appointmentId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authToken}`, // Replace with your actual token
      },
    }
  );
  console.log(
    "🚀 ~ file: PatientBookAppointment.tsx:87 ~ sendConfirmation ~ response:",
    response.data
  );
  return response.data;
};

const sendRejection = async (
  authToken: string,
  appointmentId: number
): Promise<RejectAppointmentRespone> => {
  console.log("rejecting app");
  const response = await axios.delete(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/appointment/book-online-appointment/cancel/${appointmentId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`, // Replace with your actual token
      },
    }
  );
  console.log(
    "🚀 ~ file: PatientBookAppointment.tsx:87 ~ sendConfirmation ~ response:",
    response.data
  );
  return response.data;
};

export const BookAppointment: FC = () => {
  const { doctorID } = useParams();
  console.log(doctorID);
  const [cookies] = useCookies(["user"]);
  const [weekName, setWeekName] = useState<string>("");
  const [requestedAppDialog, setRequestedAppDialog] = useState<boolean>(false);
  const [appConfirmDialog, setAppConfirmDialog] = useState<boolean>(false);
  const [rejectConfirmDialog, setRejectConfirmDialog] =
    useState<boolean>(false);
  const [doctordetails, setDoctorDetails] = useState<DoctorProfileInfo>();
  const [scheduleId, setScheduleId] = useState<number>();

  useEffect(() => {
    async function fetchData() {
      try {
        axios
          .get(
            `${import.meta.env.VITE_DB_URL}:${
              import.meta.env.VITE_DB_PORT
            }/api/doctor/profile-info/${doctorID}`,
            {
              headers: {
                Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
              },
            }
          )
          .then((response) => {
            console.log(
              "🚀 ~ file: PatientBookAppointment.tsx:133 ~ .then ~ response:",
              response.data
            );
            setDoctorDetails(response.data);
          });
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const {
    mutate,
    isLoading,
    isError,
    data: requestAppointmentData,
  } = useMutation({
    mutationFn: (input: inputObject) =>
      onSubmit(input.authToken, input.scheduleId),
  });

  const {
    mutate: mutateConfirmation,
    isLoading: isLoadingConfirm,
    isError: isErrorConfirm,
    data: ConfirmAppointmentResponse,
  } = useMutation({
    mutationFn: (input: confirmRejectObject) =>
      sendConfirmation(input.authToken, input.appointmentId),
  });

  const {
    mutate: mutateReject,
    isLoading: isLoadingReject,
    isError: isErrorReject,
    data: RejectAppointmentResponse,
  } = useMutation({
    mutationFn: (input: confirmRejectObject) =>
      sendRejection(input.authToken, input.appointmentId),
  });

  return (
    <>
      <div className="flex text-c1 text-3xl font-bold justify-center m-6">
        Book Appointment
      </div>
      <div className="flex">
        <div className="w-1/4">
          {doctordetails && <DoctorDetailsCard doctor={doctordetails!} />}
        </div>
        {doctordetails && doctordetails.OnlineSchedule.schedules && (
          <div className="flex-[60%] flex-col">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-4"></TableHead>
                  <TableHead>Weekday</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Remaining Slot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctordetails.OnlineSchedule.schedules.map((day) => {
                  return (
                    <TableRow key={day.id} className="items-center">
                      <TableCell>
                        <input
                          type="radio"
                          className="h-4 w-4 mx-3"
                          name="day"
                          id={day.id.toString()}
                          onChange={() => {
                            setWeekName(day.weekname);
                            setScheduleId(day.id);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <label htmlFor={day.weekname}>{day.weekname}</label>
                      </TableCell>
                      <TableCell>
                        <b>{day.startTime}</b>
                      </TableCell>
                      <TableCell>
                        <b>{day.endTime}</b>
                      </TableCell>
                      <TableCell>
                        <b>{day.remainingSlots}</b>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="flex justify-center mt-5">
              <Dialog open={requestedAppDialog}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-c2 w-42 text-white rounded-lg hover:bg-c1"
                    onClick={() => {
                      if (scheduleId)
                        mutate({
                          authToken: cookies.user.token,
                          scheduleId: scheduleId,
                        });
                      setRequestedAppDialog(true);
                    }}
                    disabled={weekName === ""}
                  >
                    Book Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col m:max-w-[425px] bg-c4 items-center justify-center">
                  <DialogHeader className="flex">
                    <DialogTitle className="text-c1">
                      Confirm Appointment
                    </DialogTitle>
                    <div className="flex items-center justify-center">
                      {isLoading && <LoadingSpinner />}
                    </div>
                    <DialogDescription>
                      {isError && <>Error</>}
                      {!isLoading && !isError && (
                        <>
                          {requestAppointmentData?.message}
                          <br />
                          Your appointment Date :{" "}
                          <b className="text-c1">
                            {requestAppointmentData
                              ? new Date(
                                  requestAppointmentData.appointment.startTime
                                ).toLocaleDateString()
                              : ""}
                          </b>
                          <br />
                          Your appointment Time :{" "}
                          <b className="text-c1">
                            {requestAppointmentData
                              ? new Date(
                                  requestAppointmentData.appointment.startTime
                                ).toLocaleTimeString()
                              : ""}
                          </b>
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="">
                    <DialogClose asChild>
                      <>
                        <Button
                          className="bg-c2 hover:bg-c1 "
                          disabled={isLoading || isError}
                          onClick={() => {
                            setRequestedAppDialog(false);
                            if (requestAppointmentData !== undefined) {
                              mutateConfirmation({
                                authToken: cookies.user.token,
                                appointmentId:
                                  requestAppointmentData.appointment.id,
                              });
                              setAppConfirmDialog(true);
                            }
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          className="bg-red-700 hover:bg-red-500"
                          disabled={isLoading}
                          onClick={() => {
                            setRequestedAppDialog(false);
                            if (requestAppointmentData !== undefined) {
                              mutateReject({
                                authToken: cookies.user.token,
                                appointmentId:
                                  requestAppointmentData.appointment.id,
                              });
                              setRejectConfirmDialog(true);
                            }
                          }}
                        >
                          Close
                        </Button>
                      </>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={appConfirmDialog}>
                <DialogContent className="flex flex-col m:max-w-[425px] bg-c4">
                  <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>Confirmation</DialogTitle>
                    <div>{isLoadingConfirm && <LoadingSpinner />}</div>
                    <DialogDescription>
                      {isErrorConfirm && <>Error</>}
                      {!isLoadingConfirm && !isErrorConfirm && (
                        <>
                          {ConfirmAppointmentResponse?.message}
                          <br />
                          <a
                            href={ConfirmAppointmentResponse?.appointment.meetingLink?.toString()}
                            className="text-c1 mt-6 font-bold"
                          >
                            Meeting Link
                          </a>
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="">
                    <DialogClose asChild>
                      <Button
                        className="bg-c2 hover:bg-c1 "
                        disabled={isLoading}
                        onClick={() => {
                          setAppConfirmDialog(false);
                        }}
                      >
                        OK
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={rejectConfirmDialog}>
                <DialogContent className="flex flex-col m:max-w-[425px] bg-c4">
                  <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>Cancel</DialogTitle>
                    <div>{isLoadingReject && <LoadingSpinner />}</div>
                    <DialogDescription>
                      {isErrorReject && <>Error</>}
                      {!isLoadingReject && !isErrorReject && (
                        <>{RejectAppointmentResponse?.message}</>
                      )}
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="">
                    <DialogClose asChild>
                      <Button
                        className="bg-c2 hover:bg-c1 "
                        disabled={isLoading}
                        onClick={() => {
                          setRejectConfirmDialog(false);
                        }}
                      >
                        OK
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BookAppointment;
