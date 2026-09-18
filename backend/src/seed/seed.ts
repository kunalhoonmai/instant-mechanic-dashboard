import "dotenv/config";

import mongoose from "mongoose";

import { connectDatabase } from "../config/database.js";
import Booking, {
  type BookingStatus,
} from "../models/Booking.js";
import Customer from "../models/Customer.js";
import Mechanic from "../models/Mechanic.js";
import Service from "../models/Service.js";

const services = [
  {
    serviceId: "SRV-001",
    name: "Oil Change",
    description: "Engine oil and oil filter replacement",
    basePrice: 1499,
    duration: 60,
    active: true,
  },
  {
    serviceId: "SRV-002",
    name: "AC Service",
    description: "Complete car AC inspection and servicing",
    basePrice: 2499,
    duration: 90,
    active: true,
  },
  {
    serviceId: "SRV-003",
    name: "Brake Service",
    description: "Brake inspection, cleaning and servicing",
    basePrice: 1899,
    duration: 90,
    active: true,
  },
  {
    serviceId: "SRV-004",
    name: "Battery Replacement",
    description: "Battery testing and replacement service",
    basePrice: 4599,
    duration: 45,
    active: true,
  },
  {
    serviceId: "SRV-005",
    name: "General Repair",
    description: "General vehicle inspection and repair",
    basePrice: 2799,
    duration: 120,
    active: true,
  },
  {
    serviceId: "SRV-006",
    name: "Engine Repair",
    description: "Engine diagnostics and repair",
    basePrice: 5999,
    duration: 180,
    active: true,
  },
  {
    serviceId: "SRV-007",
    name: "Wheel Alignment",
    description: "Wheel alignment and balancing",
    basePrice: 999,
    duration: 45,
    active: true,
  },
  {
    serviceId: "SRV-008",
    name: "Full Car Inspection",
    description: "Comprehensive vehicle health inspection",
    basePrice: 1299,
    duration: 60,
    active: true,
  },
];

const mechanicTemplates = [
  {
    name: "Amit Kumar",
    phone: "+91 98765 43210",
    specialization: "Engine & General Repair",
    experience: 8,
    rating: 4.9,
  },
  {
    name: "Rohit Singh",
    phone: "+91 98765 12842",
    specialization: "AC & Electrical",
    experience: 6,
    rating: 4.8,
  },
  {
    name: "Vikash Yadav",
    phone: "+91 98123 45678",
    specialization: "General Repair",
    experience: 7,
    rating: 4.7,
  },
  {
    name: "Suresh Patel",
    phone: "+91 99887 66554",
    specialization: "Brakes & Suspension",
    experience: 9,
    rating: 4.9,
  },
  {
    name: "Rajesh Sharma",
    phone: "+91 97654 32109",
    specialization: "Engine & Transmission",
    experience: 10,
    rating: 4.8,
  },
  {
    name: "Manish Verma",
    phone: "+91 98712 34567",
    specialization: "Battery & Electrical",
    experience: 5,
    rating: 4.6,
  },
  {
    name: "Deepak Rao",
    phone: "+91 98989 12345",
    specialization: "AC & General Repair",
    experience: 6,
    rating: 4.7,
  },
  {
    name: "Ankit Singh",
    phone: "+91 99123 45678",
    specialization: "Brakes & Suspension",
    experience: 4,
    rating: 4.5,
  },
];

const firstNames = [
  "Rahul",
  "Priya",
  "Arjun",
  "Sneha",
  "Vivek",
  "Neha",
  "Aditya",
  "Kavita",
  "Riya",
  "Aman",
  "Pooja",
  "Karan",
  "Nisha",
  "Rohan",
  "Anjali",
  "Mohit",
  "Simran",
  "Varun",
  "Shreya",
  "Akash",
];

const lastNames = [
  "Sharma",
  "Verma",
  "Mehta",
  "Gupta",
  "Joshi",
  "Agarwal",
  "Singh",
  "Patel",
  "Kumar",
  "Yadav",
  "Rao",
  "Malhotra",
  "Mishra",
  "Sinha",
  "Chauhan",
];

const vehicleData = [
  ["Hyundai", "Creta"],
  ["Honda", "City"],
  ["Tata", "Nexon"],
  ["Maruti", "Swift"],
  ["Kia", "Seltos"],
  ["Toyota", "Glanza"],
  ["Mahindra", "XUV700"],
  ["Volkswagen", "Taigun"],
  ["Hyundai", "i20"],
  ["Tata", "Harrier"],
  ["Honda", "Amaze"],
  ["Maruti", "Baleno"],
  ["Kia", "Sonet"],
  ["Toyota", "Innova"],
  ["Mahindra", "Thar"],
];

const cities = [
  "Delhi",
  "Noida",
  "Gurugram",
  "Ghaziabad",
  "Faridabad",
  "Greater Noida",
];

const statuses: BookingStatus[] = [
  "Completed",
  "Completed",
  "Completed",
  "Pending",
  "Assigned",
  "Cancelled",
];

function randomItem<T>(items: T[]): T {
  return items[
    Math.floor(
      Math.random() * items.length
    )
  ];
}

function randomNumber(
  min: number,
  max: number
): number {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function randomDateFromToday(
  minDays: number,
  maxDays: number
): Date {
  const date = new Date();

  const offset = randomNumber(
    minDays,
    maxDays
  );

  date.setDate(
    date.getDate() + offset
  );

  date.setHours(0, 0, 0, 0);

  return date;
}

function formatTime(
  hour: number,
  minute: number
): string {
  const suffix =
    hour >= 12 ? "PM" : "AM";

  const displayHour =
    hour % 12 || 12;

  return `${String(
    displayHour
  ).padStart(
    2,
    "0"
  )}:${String(
    minute
  ).padStart(
    2,
    "0"
  )} ${suffix}`;
}

function generateBookingTime(): string {
  const hour = randomNumber(
    9,
    17
  );

  const minutes = randomItem([
    0,
    30,
  ]);

  return formatTime(
    hour,
    minutes
  );
}

function generatePhone(
  index: number
): string {
  const number =
    9000000000 + index;

  return `+91 ${String(
    number
  ).slice(
    0,
    5
  )} ${String(
    number
  ).slice(5)}`;
}

function generateMechanicName(
  templateName: string,
  occurrence: number
): string {
  if (occurrence === 1) {
    return templateName;
  }

  return `${templateName} ${occurrence}`;
}

async function seedDatabase(): Promise<void> {
  try {
    await connectDatabase();

    console.log(
      "🌱 Starting database seed..."
    );

    await Booking.deleteMany({});
    await Customer.deleteMany({});
    await Mechanic.deleteMany({});
    await Service.deleteMany({});

    console.log(
      "🧹 Existing data cleared"
    );

    // --------------------------------------------------
    // SERVICES
    // --------------------------------------------------

    const createdServices =
      await Service.insertMany(
        services
      );

    console.log(
      `🔧 Created ${createdServices.length} services`
    );

    // --------------------------------------------------
    // MECHANICS
    // --------------------------------------------------

    const mechanicsData =
      Array.from(
        { length: 24 },
        (_, index) => {
          const templateIndex =
            index %
            mechanicTemplates.length;

          const template =
            mechanicTemplates[
              templateIndex
            ];

          const occurrence =
            Math.floor(
              index /
                mechanicTemplates.length
            ) + 1;

          const mechanicNumber =
            index + 1;

          return {
            mechanicId:
              `MEC-${String(
                mechanicNumber
              ).padStart(
                3,
                "0"
              )}`,

            /*
             * Every mechanic has a unique
             * display name.
             *
             * Example:
             * Amit Kumar
             * Amit Kumar 2
             * Amit Kumar 3
             */
            name:
              generateMechanicName(
                template.name,
                occurrence
              ),

            phone:
              occurrence === 1
                ? template.phone
                : generatePhone(
                    index + 100
                  ),

            specialization:
              template.specialization,

            experience:
              template.experience +
              (occurrence - 1),

            rating: Math.max(
              4.3,
              Number(
                (
                  template.rating -
                  Math.random() * 0.3
                ).toFixed(1)
              )
            ),

            availability:
              Math.random() > 0.15
                ? ("Available" as const)
                : ("Offline" as const),
          };
        }
      );

    const createdMechanics =
      await Mechanic.insertMany(
        mechanicsData
      );

    console.log(
      `👨‍🔧 Created ${createdMechanics.length} mechanics`
    );

    // --------------------------------------------------
    // CUSTOMERS
    // --------------------------------------------------

    const customersData =
      Array.from(
        { length: 60 },
        (_, index) => {
          const firstName =
            randomItem(
              firstNames
            );

          const lastName =
            randomItem(
              lastNames
            );

          const name =
            `${firstName} ${lastName}`;

          const vehicle =
            randomItem(
              vehicleData
            );

          return {
            customerId:
              `CUS-${String(
                index + 1
              ).padStart(
                4,
                "0"
              )}`,

            name,

            phone:
              generatePhone(
                index + 1
              ),

            email:
              `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index + 1}@example.com`,

            address:
              `${randomNumber(
                10,
                999
              )}, ${randomItem(
                cities
              )}, India`,

            vehicles: [
              {
                make: vehicle[0],
                model: vehicle[1],
                year: randomNumber(
                  2018,
                  2025
                ),
                registrationNumber:
                  `DL${randomNumber(
                    1,
                    9
                  )}${String.fromCharCode(
                    65 +
                      (index %
                        26)
                  )}${String.fromCharCode(
                    65 +
                      ((index +
                        5) %
                        26)
                  )}${randomNumber(
                    1000,
                    9999
                  )}`,
              },
            ],
          };
        }
      );

    const createdCustomers =
      await Customer.insertMany(
        customersData
      );

    console.log(
      `👥 Created ${createdCustomers.length} customers`
    );

    // --------------------------------------------------
    // BOOKINGS
    // --------------------------------------------------

    const bookingsData =
      Array.from(
        { length: 600 },
        (_, index) => {
          const customer =
            randomItem(
              createdCustomers
            );

          const mechanic =
            randomItem(
              createdMechanics
            );

          const service =
            randomItem(
              createdServices
            );

          const customerVehicle =
            randomItem(
              customer.vehicles
            );

          const status =
            randomItem(
              statuses
            );

          const basePrice =
            service.basePrice;

          const amount =
            Math.max(
              499,
              basePrice +
                randomNumber(
                  -200,
                  800
                )
            );

          return {
            bookingId:
              `BK-${10285 + index}`,

            customer:
              customer._id,

            mechanic:
              status === "Pending" &&
              Math.random() < 0.35
                ? null
                : mechanic._id,

            service:
              service._id,

            vehicle: {
              make:
                customerVehicle.make,

              model:
                customerVehicle.model,

              year:
                customerVehicle.year,

              registrationNumber:
                customerVehicle.registrationNumber,
            },

            /*
             * Generate bookings from
             * 30 days in the past through
             * TODAY.
             *
             * No future bookings are seeded.
             * This prevents future dates from
             * appearing as "Last Booking".
             */
            date:
              randomDateFromToday(
                -30,
                0
              ),

            time:
              generateBookingTime(),

            amount,

            status,

            notes:
              Math.random() > 0.7
                ? randomItem([
                    "Customer requested doorstep service",
                    "Vehicle requires detailed inspection",
                    "Customer reported unusual noise",
                    "Check vehicle before service",
                  ])
                : undefined,
          };
        }
      );

    const createdBookings =
      await Booking.insertMany(
        bookingsData
      );

    console.log(
      `📅 Created ${createdBookings.length} bookings`
    );

    // --------------------------------------------------
    // SUMMARY
    // --------------------------------------------------

    console.log("");
    console.log(
      "================================"
    );
    console.log(
      "🎉 DATABASE SEED COMPLETED"
    );
    console.log(
      "================================"
    );
    console.log(
      `🔧 Services:  ${createdServices.length}`
    );
    console.log(
      `👨‍🔧 Mechanics: ${createdMechanics.length}`
    );
    console.log(
      `👥 Customers: ${createdCustomers.length}`
    );
    console.log(
      `📅 Bookings:  ${createdBookings.length}`
    );
    console.log(
      "================================"
    );
    console.log("");
  } catch (error) {
    console.error(
      "❌ Seed failed"
    );

    if (
      error instanceof Error
    ) {
      console.error(
        error.message
      );
    }

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();

    console.log(
      "🔌 MongoDB connection closed"
    );
  }
}

seedDatabase();