import Auth from "../../../utils/auth";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const initBusinessData = {
  owner: "", // the owner id will be added later
  businessName: "",
  phone: "",
  address: "",
  location: { type: "Point", coordinates: [] },
  businessImage: null, // if the business image is already uploaded, this field will contain the file name
  businessImageData: "", // if user select a new image, this field will contain the image data
  businessType: "",
  services: [], // { serviceName: "", price: "", duration: "" }
  staff: [], // { staffName: "", password: "" }
  openingHours: {
    openingTime: "08:00 AM",
    closingTime: "05:00 PM",
    Monday: Array(9).fill(true), //  each entry is for a 1-hour interval,
    Tuesday: Array(9).fill(true), // and the array is for the whole day, from openingTime to closingTime
    Wednesday: Array(9).fill(true),
    Thursday: Array(9).fill(true),
    Friday: Array(9).fill(true),
    Saturday: Array(9).fill(true),
    Sunday: Array(9).fill(true),
  },
  exceptionalClosures: [], // { date: Date, startTime: Date, endTime: Date }
};

export function castBusinessDataToBusinessSchema(
  businessData,
  imageFileName,
  oldOpeningHours
) {
  const businessSchemaData = { ...businessData };

  // Add the owner id to the business data
  businessSchemaData.owner = Auth.getUser().id;
  // set the businessImage to the image file name
  if (imageFileName) businessSchemaData.businessImage = imageFileName;

  // set the staff working hours

  // get the business working hours
  const defaultWorkingHours = {
    Monday: businessSchemaData.openingHours.Monday,
    Tuesday: businessSchemaData.openingHours.Tuesday,
    Wednesday: businessSchemaData.openingHours.Wednesday,
    Thursday: businessSchemaData.openingHours.Thursday,
    Friday: businessSchemaData.openingHours.Friday,
    Saturday: businessSchemaData.openingHours.Saturday,
    Sunday: businessSchemaData.openingHours.Sunday,
  };

  for (const staff of businessSchemaData.staff) {
    // if it is a new staff and has no working hours, set the bussiness working hours as the default
    if (!staff.workingHours) {
      staff.workingHours = defaultWorkingHours;
    } else {
      // A week of working hours, from Monday to Sunday, from 00:00 to 23:00
      const generalWorkingHours = {
        Monday: Array(24).fill(false),
        Tuesday: Array(24).fill(false),
        Wednesday: Array(24).fill(false),
        Thursday: Array(24).fill(false),
        Friday: Array(24).fill(false),
        Saturday: Array(24).fill(false),
        Sunday: Array(24).fill(false),
      };
      // get the open hours of the business
      const oldStartTime = dayjs(oldOpeningHours.openingTime, "hh:mm A").hour();
      const oldEndTime = dayjs(oldOpeningHours.closingTime, "hh:mm A").hour();
      const newStartTime = dayjs(
        businessSchemaData.openingHours.openingTime,
        "hh:mm A"
      ).hour();
      const newEndTime = dayjs(
        businessSchemaData.openingHours.closingTime,
        "hh:mm A"
      ).hour();

      // set general working hours to true if the business is working

      // businessSchemaData.openingHours.* is the array of the opening hours of the business, so if the business starts at 8:00 AM, the first element of the array is for 8:00 AM
      // generalWorkingHours.* is the array of the general working hours, the 0 index is for 00:00, so the start time will be the newStartTime
      // bIndex is the index of the business working hours, it starts from 0
      // gIndex is the index of the general working hours, it starts from newStartTime
      for (
        let gIndex = newStartTime, bIndex = 0;
        gIndex < newEndTime;
        gIndex++, bIndex++
      ) {
        for (const day of WEEK_DAYS) {
          generalWorkingHours[day][gIndex] =
            businessSchemaData.openingHours[day][bIndex];
        }
      }

      // with the same logic for gIndex and bIndex, now we set the working hours of the staff
      for (
        let gIndex = oldStartTime, sIndex = 0;
        gIndex < oldEndTime;
        gIndex++, sIndex++
      ) {
        for (const day of WEEK_DAYS) {
          // if the business is open then staff can work or not
          if (generalWorkingHours[day][gIndex] === true)
            generalWorkingHours[day][gIndex] = staff.workingHours[day][sIndex];
        }
      }

      // now just the part of the general working hours that is between the new start time and the new end time is the working hours of the staff
      for (const day of WEEK_DAYS) {
        staff.workingHours[day] = generalWorkingHours[day].slice(
          newStartTime,
          newEndTime
        );
      }
    }
  }

  return businessSchemaData;
}

export function checkBusinessData(businessData) {
  if (!businessData.businessName) {
    return "Business name is required";
  }
  if (!businessData.phone) {
    return "Phone number is required";
  }
  if (!businessData.address) {
    return "Address is required";
  }
  if (businessData.location.coordinates.length != 2) {
    return "Location is required";
  }
  if (!businessData.businessType) {
    return "Business type is required";
  }
  if (businessData.services.length === 0) {
    return "At least one service is required";
  }
  if (businessData.staff.length === 0) {
    return "At least one staff member is required";
  }
  return "ok";
}
