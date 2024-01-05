# API Documentation

## List of Microservices
- [Medicine Services](#medicine-services)
- [Doctor Services](#doctor-services)
- [Patient Services](#patient-services)
- [Appointment Services](#appointment-services)
- [Auth Services](#auth-services)
---
## Medicine Services
### ```GET``` View Medicine List
| API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/medicine/get_all_medicines?filterBy="brands"]() | ```GET``` | 200 OK | 
||||
#### Request Query
```json
{
  "filterBy": "brands/generics/manufacturer"
}
```

#### Response Body
```json
{
  "Medicines": [
      {
        "name": "Napa",
        "Strength": "500 mg",
        "Generics": "Paracetamol",
        "Manufacturer": "Beximco Pharmaceuticals Ltd.",
        "Dosage": {
          "Type": "Suppository",
          "Icon": "url"
        }
      }
  ]
}
```
### ```GET```	Search Medicines
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/medicine/get_all_medicines?filterBy=”brands”&searchBy=”napa”]() | ```GET``` | 200 OK | 
||||

#### Request Query
```json
{
  "filterBy": "brands/generics/manufacturer",
  "searchBy": "napa"
}
```

#### Response Body
```json
{
  "Medicines": [
      {
        "name": "Napa",
        "Strength": "500 mg",
        "Generics": "Paracetamol",
        "Manufacturer": "Beximco Pharmaceuticals Ltd.",
        "Dosage": {
          "Type": "Suppository",
          "Icon": "url"
        }
      }
  ]
}
```
### ```GET``` View Details of a Selected Medicine
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/medicine/get_medicine_info/:medicineID]() | ```GET``` | 200 OK |
||||

#### Request Params
```json
{
  "medicineID": "1002"
}
```

#### Response Body
```json
{
  "name": "Napa",
  "Strength": "500 mg",
  "Generics": "Paracetamol",
  "Manufacturer": "Beximco Pharmaceuticals Ltd.",
  "Dosage": {
    "Type": "Suppository",
    "Icon": "url"
  }
}
```
---
## Doctor Services

### ```GET``` Retrieve Specializations
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/doctor/specialization]() | ```GET``` | 200 OK |
||||

#### Response Body
```json
{
  "Specializations" : ["neurology", "ENT"]
}
```

### ```GET``` Search For Doctor
| API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/patient/search_doctor?filterByName=”strange”&filterBySpecialization=”neurology”]() | ```GET``` | 200 OK | 
||||
#### Request Query
```json
{
  "filterByName": "strange",
  "filterBySpecialization": "neurology"
}
```

#### Response Body
```json
{
  "Doctors": [
    {
      "Name": "Dr. Strange",
      "Ratings": "4.8",
      "Experience": "10 years of experience",
      "Degrees" : ["MBBS", "FCPS"],
      "Clinics": []
    }
  ]
}
```

### ```GET``` View Doctor’s Info
| API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/doctor/search_doctor/:doctorID]() | ```GET``` | 200 OK | 
||||
#### Request Params
```json
{
  "doctorID" : 2001
}
```

#### Response Body
```json
{
  "Name": "Dr. Strange",
  "Img": "url",
  "Ratings": "4.8",
  "Experience": "10 years of experience",
  "Degrees": ["MBBS","FCPS"],
  "Clinics": [
    {
      "Clinic_name": "Multiverse Hospital",
      "Address": {
        "name":"221 B, Baker’s Street "
      },
      "Approx_distance": "16 km",
      "Visit_fee": "1300",
      "Contact": "017xxxxxxxx",
      "Schedule": [
        {
          "Day": "Saturday ",
          "Time_start": "4:00 pm",
          "Time_end": "6:00 pm",
          "Slot_capacity": "5"
        }
      ]
    }
  ]
}
```

### ```GET``` View All Clinics
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/doctor/clinic]() | ```GET``` | 200 OK |
||||

#### Request Body
```json
{}
```

#### Response Body
```json
{
  "Clinics": [
    {
      "Clinic_name": "Multiverse Hospital",
      "Address": {
        "name":"221 B, Baker’s Street "
      },
      "Visit_fee": "1300",
      "Contact": "017xxxxxxxx",
      "Schedule": []
    }
  ]
}
```

### ```GET``` View Online Visits
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/doctor/online_visit]() | ```GET``` | 200 OK |
||||


#### Response Body
```json
{
  "online_visit": {
    "Visit_fee": "1300",
    "Contact": "017xxxxxxxx",
    "Time_slots": [
      {
        "Time_slot_id": 231231,
        "Date": "17/07/23",
        "Time_start": "4:00 pm",
        "Time_end": "4:20 pm",
        "Booking_status": "occupied",
        "Meet_link": ".......... "
      }
    ]
  }
}
```

### ```PUT``` Edit Info for Online Visits
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/doctor/online_visit]() | ```PUT``` | 200 OK |
||||

#### Request Body
```json
{
  "Visit_fee" : "1300"
}
```

#### Response Body
```json
{
  "online_visit": {
    "Visit_fee": "1300",
    "Contact": "017xxxxxxxx",
    "Time_slots": [
      {
        "Time_slot_id": 231231,
        "Date": "17/07/23",
        "Time_start": "4:00 pm",
        "Time_end": "4:20 pm",
        "Booking_status": "occupied",
        "Meet_link": ".......... "
      }
    ]
  }
}
```

### ```POST``` Adding new Time Slots for Online Visit
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/doctor/online_visit/add_schedule]() | ```POST``` | 201 Created |
||||

#### Request Body
```json
{
  "Time_slots": [
    {
      "Date": "17/07/23",
      "Time_start": "4:00 pm",
      "Time_end": "4:20 pm"
    }
  ]
}
```

#### Response Body
```json
{
  "Message": "new time slot added.",
  "online_visit": {
    "Visit_fee": "1300",
    "Contact": "017xxxxxxxx",
    "Time_slots": [
      {
        "Time_slot_id": 231231,
        "Date": "17/07/23",
        "Time_start": "4:00 pm",
        "Time_end": "4:20 pm",
        "Booking_status": "unoccupied",
        "Meet_link": null
      }
    ]
  }
}
```

### ```POST``` Adding New Clinic
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/doctor/clinic]() | ```POST``` | 202 Accepted |
||||

#### Request Body
```json
{
  "Clinic_name": "Multiverse Hospital",
  "Address": {
    "name":"221 B, Baker’s Street "
  },
  "Visit_fee": "1300",
  "Contact": "017xxxxxxxx"
}
```

#### Response Body
```json
{
  "Message": "temporary clinic created.",
  "Clinic": {
    "Clinic_id": 10002
  },
  "Clinic_name": "Multiverse Hospital",
  "Address": {
    "name":"221 B, Baker’s Street "
  },
  "Visit_fee": "1300",
  "Contact": "017xxxxxxxx",
  "Status": "temporary",
  "Assistant_status" : "unassigned"
}
```

### ```POST``` Add Schedule to the New Clinic Created
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/doctor/clinic/:clinicID]() | ```POST``` | 201 Created |
||||

#### Request Body
```json
[
  {
    "Day": "Saturday ",
    "Time_start": "4:00 pm",
    "Time_end": "6:00 pm",
    "Slot_capacity": "5"
  }
]
```

#### Response Body
```json
{
  "Message": "clinic created successfully.",
  "Clinic": {
    "Clinic_id": 10002,
    "Clinic_name": "Multiverse Hospital",
    "Address": {
      "name":"221 B, Baker’s Street "
    },
    "Visit_fee": "1300",
    "Contact": "017xxxxxxxx",
    "Status": "final",
    "Assistant_status" : "unassigned",
    "Schedule": [
      {
        "Day": "Saturday ",
        "Time_start": "4:00 pm",
        "Time_end": "6:00 pm",
        "Slot remaining": "5"
      }
    ]
  }
}
```
### ```POST``` Add Assistant to a Clinic
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/doctor/clinic/add_assistant/:clinicID]() | ```POST``` | 200 OK |
||||

#### Request Body
```json
{
  "assistantID" : 31243
}
```

#### Response Body
```json
{
  "Message": "requested to the Assistant. Wait for confirmation.",
  "Clinic": {
    "Assistant_status": "pending"
  }
}
```

### ```DELETE``` Remove Assistant from a Clinic
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/doctor/clinic/add_assistant/:clinicID]() | ```DELETE``` | 200 OK |
||||

#### Request Body
```json 
{
  "assistantID" : 31243
}
```

#### Response Body
```json
{
  "Message": "Assistant removed.",
  "Clinic": {
    "Assistant_status": "unassigned"
  }
}
```

### ```PUT``` Edit Schedule of a Specific Clinic
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/doctor/clinic/:clinicID]() | ```PUT``` | 200 OK |
||||

#### Request Body
```json
{
  "Schedule": [
    {
      "Day": "Saturday ",
      "Time_start": "4:00 pm",
      "Time_end": "6:00 pm",
      "Slot_capacity": "5"
    },
    {
      "Day": "Sunday ",
      "Time_start": "5:00 pm",
      "Time_end": "7:00 pm",
      "Slot_capacity": "5"
    }
  ]
}
```

#### Response Body
```json
{
  "Message": "schedule edited for the clinic",
  "Clinic": {
    "Clinic_id": 10002,
    "Clinic_name": "Multiverse Hospital",
    "Address": {
      "name":"221 B, Baker’s Street "
    },
    "Visit_fee": "1300",
    "Contact": "017xxxxxxxx",
    "Status": "final",
    "Schedule": [
      {
        "Day": "Saturday ",
        "Time_start": "4:00 pm",
        "Time_end": "6:00 pm",
        "Slot_capacity": "5"
      },
      {
        "Day": "Sunday ",
        "Time_start": "5:00 pm",
        "Time_end": "7:00 pm",
        "Slot_capacity": "5"
      }
    ]
  }
}
```
---
## Patient Services
### ```GET``` View Patient's Info
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/patient/search_patient/:patientID ]() | ```GET``` | 200 OK |
||||

#### Request Params
```json
{
  "patientID" : 2001
}
```

#### Response Body
```json
{
  "Name": "Sheikh Evan",
  "Age": 22,
  "Contact": "017********",
  "Img" : "url"
}
```
---

## Appointment Services
### ```GET``` View Appointments
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/appointment?filterByName="strange"&filterBySpecialization=""&filterByStatus="completed"&filterByDate="17/03/2023"]() | ```GET``` | 200 OK |
||||

#### Request Query
```json
{
  "filterByName": "strange",
  "filterBySpecialization": "",
  "filterByStatus": "completed/pending",
  "filterByDate" : "17/03/2023"
}
```

#### Response Body
```json
{        
  "Appointments" : [],
  "Online_Appointments" : []
}
```

### ```GET``` View Appointments of a Clinic
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/appointment/:clinic?filterByName="evan"&filterByStatus="completed"&filterByDate="17/03/2023"]() | ```GET``` | 200 OK |
||||

#### Request Query
```json
{
  "filterByName": "evan",
  "filterByStatus": "completed/pending",
  "filterByDate" : "17/03/2023"
}
```

#### Response Body
```json
{        
  "Appointments" : [],
  "Online_Appointments" : []
}
```


### ```DELETE``` Delete an Appointment
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/appointment/:appointmentID]() | ```DELETE``` | 200 OK |
||||

#### Request Params
```json
{
  "appointmentID" : 512,
}
```

#### Response Body
```json
{
  "Message": "appointment deleted successfully",
  "Appointments": []
}
```

### ```POST``` Booking Appointment
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/appointment/book_appointment/:clinicID]() | ```POST``` | 202 Accepted |
||||

#### Request Params
```json
{
  "clinicID" : 102
}
```

#### Request Body
```json
{        
  "Date" : "17/07/23"        
}
```

#### Response Body
```json
{
  "Message": "Temporary appointment created. Proceed to payment",
  "Appointment": {
    "Id": 23212,
    "Doctor": {
      "id": 2002,
      "Name": "Dr. Strange"
    },
    "Clinic": {
      "id": 123,
      "Name": "Azimpur Hospital"
    },
    "Date": "17/07/23",
    "Status": "unpaid",
    "patientID": 11
  }
}
```

### ```POST``` Booking Online Appointment
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/appointment/book_online_appointment/:time_slot_ID]() | ```POST``` | 202 Accepted |
||||

#### Request Params
```json
{
  "time_slot_ID" : 1231,
}
```

#### Response Body
```json
{
  "Message": "Temporary appointment created. Proceed to payment",
  "Online_Appointment": {
    "AppointmentID": 23212,
    "Doctor": {
      "id": 2002,
      "Name": "Dr. Strange"
    },
    "Time_slot": {
      "time_slot_ID": 321321,
      "meet_link": "-------"
    },
    "Status": "unpaid",
    "patientID": 11
  }
}
```

### ```PUT``` Sharing Past Records for New Appointment
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/appointment/share_records/:appointmentID]() | ```PUT``` | 200 OK |
||||

#### Request Params
```json
{
  "appointmentID" : 23212
}
```

#### Request Body
```json
{
  "Prev_appoinments": [
    {
      "appoinmentID": 2031
    }
  ],
  "Prev_Online_Appointments": [
    {
      "appoinmentID": 2031
    }
  ]
}
```

#### Response Body
```json
{
  "Message": "Previous Records are shared successfully",
  "Appointment": {
    "AppointmentId": 23212,
    "doctorID": 2002,
    "clinicID": 500,
    "Time_slot_id": null,
    "Date": "17/07/23",
    "Status": "pending",
    "Past_appointments": [],
    "Shared_appointments": []
  }
}
```

### ```GET``` Viewing Shared Prescriptions of an Appointment
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/appointment/share_records/:appointmentID]() | ```GET``` | 200 OK |
||||

#### Request Params
```json
{
  "appointmentID": 101
}
```

#### Response Body
```json
{
  "Appointment": {
    "Past_appointments": [],
    "Shared_appointments": []
  }
}
```

### ```GET``` Viewing Prescription
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/appointment/prescription/:appointmentID]() | ```GET``` | 200 OK |
||||

#### Request Params
```json
{
  "appointmentID": 101
}
```

#### Response Body
```json
{
  "Date": "17/07/23",
  "Past_appointments": [],
  "Shared_appointments": [],
  "Diagnosis": [],
  "Symptoms": [],
  "Additional_info": [],
  "Past_history": [],
  "Medicines": [
    {
      "Medicine": {},
      "Dosage": "1+0+1",
      "When": "before",
      "Durations": "5 days"
    }
  ],
  "Tests": [],
  "Advice": [],
  "Meet_after": ""
}
```

### ```POST``` Generating Prescription
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/appointment/prescription/:appointmentID]() | ```POST``` | 200 OK |
||||

#### Request Params
```json
{
  "appointmentID": 101
}
```

#### Request Body
```json
{
  "Diagnosis": [],
  "Symptoms": [],
  "Additional_info": [],
  "Past_history": [],
  "Medicines": [
    {
      "Medicine": {},
      "Dosage": "1+0+1",
      "When": "before",
      "Durations": "5 days"
    }
  ],
  "Tests": [],
  "Advice": [],
  "Meet_after": ""
}
```

#### Response Body
```json
{
  "Appointment": {
    "Status": "unrated"
  }
}
```

### ```PUT``` Rating Appointment
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/appointment/prescription/:appointmentID]() | ```PUT``` | 200 OK |
||||

#### Request Params
```json
{
  "appointmentID": 101
}
```

### Request Body
```json
{
  "Rating": "4.2"
}
```

#### Response Body
```json
{
  "Appointment": {
    "Status": "completed"
  }
}
```

### ```GET``` Assistant Service
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/Assistant/clinics]() | ```GET``` | 200 OK |
||||

#### Response Body
```json
{
  "Clinics": [
    {
      "clinicID": 123123,
      "Assistant_status": "confirmed"
    },
    {
      "clinicID": 123222,
      "Assistant_status": "pending"
    }
  ]
}
```

### ```PUT``` Accept/Reject Invitation
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/Assistant/clinics/:clinicID?accept="true"]() | ```PUT``` | 200 OK |
||||

#### Request Query
```json
{
  "Accept" : true
}
```

#### Request Body
```json
{
  "clinicID" : 123222
}
```

#### Response Body
```json
{
  "Clinics": [
    {
      "clinicID": 123123,
      "Assistant_status": "confirmed"
    },
    {
      "clinicID": 123222,
      "Assistant_status": "confirmed"
    }
  ]
}
```

### ```GET``` Admin Service
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/Admin/pending_doctors]() | ```GET``` | 200 OK |
||||

#### Response Body
```json
{
  "Doctors": [
    {
      "doctorID": 123123,
      "Verification_status": "unverified"
    }
  ]
}
```

### ```PUT``` Accept/Reject Doctor
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/Admin/verify_doctors/:doctorID?accept="false"]() | ```PUT``` | 200 OK |
||||

#### Request Query
```json
{
  "Accept" : "false"
}
```

#### Request Params
```json
{
  "doctorID" : 123222
}
```

#### Response Body
```json
{
  "Message" : "this doctor has been rejected"
}
```


## Auth Services

### ```POST``` Login
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/auth/login]() | ```POST``` | 200 OK |
||||

#### Request Body
```json
{
  "Email": " ",
  "Password": " ",
  "Login_as": " "
}
```

#### Response Body
```json
{
  "Message" : "successful"
}
```

### ```POST``` Doctor Registration
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/auth/doctor/register]() | ```POST``` | 201 Accepted |
||||

#### Request Body
```json
{
  "Name": " ",
  "Email": " ",
  "Phone_no": " ",
  "Password": " ",
  "Gender": " ",
  "Date-of-Birth": " ",
  "BMDC": " ",
  "BMDC_issue_date": " ",
  "Degree": [],
  "Department": " ",
  "Img": " "
}
```

#### Response Body
```json
{
  "Message": "please wait for verification. You will be notified"
}
```

### ```POST``` Patient Registration
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/auth/patient/register]() | ```POST``` | 201 Accepted |
||||

#### Request Body
```json
{
  "Name": " ",
  "Email": " ",
  "Phone_no": " ",
  "Password": " ",
  "Gender": " ",
  "Date-of-Birth": " ",
  "Location":{
    "name":""
  },
  "Height": " ",
  "Weight": " ",
  "Blood Group": " ",
  "Img": " "
}
```

#### Response Body
```json
{
  "Message" : "user created"
}
```