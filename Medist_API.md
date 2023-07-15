# API Documentation

## List of Microservices
- [Medicine Services](#medicine-services)
- [Doctor Services](#doctor-services)
- [Patient Services](#patient-services)
- [Appointment Services](#appointment-services)
---
## Medicine Services
### ```GET``` View Medicine List
| API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/medicine/get_all_medicinesfilterBy="brands"]() | ```GET``` | 200 OK | 
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

#### Request Body
```json
{}
```

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
  "Ratings": "4.8",
  "Experience": "10 years of experience",
  "Degrees": [
    "MBBS",
    "FCPS"
  ],
  "Clinics": [
    {
      "Clinic_name": "Multiverse Hospital",
      "Address": "221 B, Baker’s Street ",
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
      "Address": "221 B, Baker’s Street ",
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

### ```POST``` Adding New Clinic
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/doctor/clinic]() | ```POST``` | 202 Accepted |
||||

#### Request Body
```json
{
  "Clinic_name": "Multiverse Hospital",
  "Address": "221 B, Baker’s Street ",
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
  "Address": "221 B, Baker’s Street ",
  "Visit_fee": "1300",
  "Contact": "017xxxxxxxx",
  "Status": "temporary"
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
    "Address": "221 B, Baker’s Street ",
    "Visit_fee": "1300",
    "Contact": "017xxxxxxxx",
    "Status": "final",
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

### ```PUT``` Edit Schedule to an Specific Clinic
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/doctor/clinic/:clinicID]() | ```PUT``` | 201 Created |
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
  "Message": "schedule edited to the clinic",
  "Clinic": {
    "Clinic_id": 10002,
    "Clinic_name": "Multiverse Hospital",
    "Address": "221 B, Baker’s Street ",
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
  "Contact": "017********"
}
```
---

## Appointment Services
### ```GET``` View Appointments
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/appointment?filterByName="strange"&filterBySpecialization=""&filterByStatus="completed" ]() | ```GET``` | 200 OK |
||||

#### Request Query
```json
{
  "filterByDoctor": "strange",
  "filterBySpecialization": "",
  "filterByStatus": "completed/pending"
}
```

#### Response Body
```json
{
  "Appointments": [
    {
      "Id": 2002,
      "doctorID": 100,
      "clinicID": 5002,
      "Date": "10/06/23",
      "Rating": 4.3,
      "Diagnosis": [
        "xyz",
        "abc"
      ],
      "Status": "completed",
      "patientID": 11
    }
  ]
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
  "Appointments": [
    {
      "Id": 2002,
      "doctorID": 100,
      "clinicID": 5002,
      "Date": "10/06/23",
      "Rating": 4.3,
      "Diagnosis": [
        "xyz",
        "abc"
      ],
      "Status": "completed"
    }
  ]
}
```

### ```POST``` Booking Appointment
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/patient/book_appointment/:clinicID]() | ```POST``` | 202 Accepted |
||||

#### Request Params
```json
{
  "clinicID" : 102
}
```

#### Response Body
```json
{	
  "Date" : "17/07/23",	
}
```

### ```PUT``` Sharing Past Records for New Appointment
|API Endpoint | HTTP Method| Response Code | 
| --- | :---: | :---: |
| [api/patient/appointment/:appointmentID]() | ```PUT``` | 200 OK |
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
  "prev_appointments": [
    {
      "appoinmentID": 2031
    }
  ]
}
```

#### Response Body
```json
{
  "Message": "preference saved",
  "Appointment": {
    "Id": 23212,
    "doctorID": 2002,
    "Date": "17/07/23",
    "Status": "pending",
    "Past_appointments": [
      {
        "Id": 2002,
        "Date": "10/06/23",
        "Rating": 4.3,
        "Diagnosis": [
          "xyz",
          "abc"
        ]
      }
    ],
    "Shared_appointments": [
      {
        "Id": 2002,
        "doctorID": 100,
        "clinicID": 5002,
        "Date": "10/06/23",
        "Rating": 4.3,
        "Diagnosis": [
          "xyz",
          "abc"
        ]
      }
    ]
  }
}
```