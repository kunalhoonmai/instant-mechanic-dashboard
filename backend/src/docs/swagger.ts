import type { OpenAPIV3 } from "openapi-types";

const swaggerDocument: OpenAPIV3.Document = {
  openapi: "3.0.3",

  info: {
    title: "Instant Mechanic API",
    version: "1.0.0",
    description:
      "REST API for the Instant Mechanic operations dashboard, including bookings, mechanics, customers, services, dashboard analytics, and operational analytics.",
  },

  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
    {
      url: "https://instant-mechanic-backend-615s.onrender.com",
      description: "Production server",
    },
  ],

  tags: [
    {
      name: "Health",
      description: "API health and service status",
    },
    {
      name: "Dashboard",
      description: "Dashboard overview and operational metrics",
    },
    {
      name: "Bookings",
      description: "Booking management",
    },
    {
      name: "Mechanics",
      description: "Mechanic management",
    },
    {
      name: "Customers",
      description: "Customer management",
    },
    {
      name: "Services",
      description: "Available mechanic services",
    },
    {
      name: "Analytics",
      description: "Operational analytics and performance metrics",
    },
  ],

  paths: {
    "/": {
      get: {
        tags: ["Health"],
        summary: "Get API information",
        responses: {
          "200": {
            description: "API is running",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiInfoResponse",
                },
                example: {
                  success: true,
                  message: "🚗 Instant Mechanic API",
                  version: "1.0.0",
                  status: "running",
                },
              },
            },
          },
        },
      },
    },

    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "API health status",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthResponse",
                },
                example: {
                  success: true,
                  message: "Instant Mechanic API is running",
                  timestamp: "2026-09-18T14:10:21.723Z",
                },
              },
            },
          },
        },
      },
    },

    "/api/dashboard": {
      get: {
        tags: ["Dashboard"],
        summary: "Get dashboard overview",
        description:
          "Returns dashboard KPIs, booking status distribution, service performance, and the last 30 days of booking activity.",
        responses: {
          "200": {
            description: "Dashboard data",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DashboardResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/bookings": {
      get: {
        tags: ["Bookings"],
        summary: "Get all bookings",
        responses: {
          "200": {
            description: "List of bookings",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BookingListResponse",
                },
              },
            },
          },
        },
      },

      post: {
        tags: ["Bookings"],
        summary: "Create a booking",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateBookingInput",
              },
              example: {
                customerId: "68c123456789abcdef123456",
                mechanicId: "68c123456789abcdef123457",
                serviceId: "68c123456789abcdef123458",
                vehicle: {
                  make: "Toyota",
                  model: "Camry",
                  year: 2022,
                  registrationNumber: "MP09AB1234",
                },
                date: "2026-09-20",
                time: "10:30 AM",
                amount: 850,
                status: "Pending",
                notes: "Customer requested doorstep service.",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Booking created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BookingMutationResponse",
                },
              },
            },
          },
          "400": {
            description: "Missing required booking fields",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/bookings/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "MongoDB ObjectId of the booking",
          schema: {
            type: "string",
          },
        },
      ],

      get: {
        tags: ["Bookings"],
        summary: "Get a booking by ID",
        responses: {
          "200": {
            description: "Booking details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BookingResponse",
                },
              },
            },
          },
          "404": {
            description: "Booking not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NotFoundResponse",
                },
              },
            },
          },
        },
      },

      patch: {
        tags: ["Bookings"],
        summary: "Update a booking",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateBookingInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Booking updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BookingMutationResponse",
                },
              },
            },
          },
          "404": {
            description: "Booking not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NotFoundResponse",
                },
              },
            },
          },
        },
      },

      delete: {
        tags: ["Bookings"],
        summary: "Delete a booking",
        responses: {
          "200": {
            description: "Booking deleted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BookingMutationResponse",
                },
              },
            },
          },
          "404": {
            description: "Booking not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NotFoundResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/mechanics": {
      get: {
        tags: ["Mechanics"],
        summary: "Get all mechanics",
        responses: {
          "200": {
            description: "List of mechanics with operational statistics",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MechanicListResponse",
                },
              },
            },
          },
        },
      },

      post: {
        tags: ["Mechanics"],
        summary: "Create a mechanic",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateMechanicInput",
              },
              example: {
                name: "Amit Sharma",
                phone: "+91 9876543210",
                specialization: "Engine Specialist",
                experience: 7,
                rating: 4.8,
                availability: "Available",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Mechanic created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MechanicMutationResponse",
                },
              },
            },
          },
          "400": {
            description: "Missing required mechanic fields",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/mechanics/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "MongoDB ObjectId of the mechanic",
          schema: {
            type: "string",
          },
        },
      ],

      get: {
        tags: ["Mechanics"],
        summary: "Get a mechanic by ID",
        responses: {
          "200": {
            description: "Mechanic details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MechanicResponse",
                },
              },
            },
          },
          "404": {
            description: "Mechanic not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NotFoundResponse",
                },
              },
            },
          },
        },
      },

      patch: {
        tags: ["Mechanics"],
        summary: "Update a mechanic",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateMechanicInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Mechanic updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MechanicMutationResponse",
                },
              },
            },
          },
          "404": {
            description: "Mechanic not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NotFoundResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/customers": {
      get: {
        tags: ["Customers"],
        summary: "Get all customers",
        responses: {
          "200": {
            description: "List of customers with booking statistics",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CustomerListResponse",
                },
              },
            },
          },
        },
      },

      post: {
        tags: ["Customers"],
        summary: "Create a customer",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateCustomerInput",
              },
              example: {
                name: "Rahul Verma",
                phone: "+91 9876543210",
                email: "rahul@example.com",
                address: "Indore, Madhya Pradesh",
                vehicles: [
                  {
                    make: "Honda",
                    model: "City",
                    year: 2023,
                    registrationNumber: "MP09CD5678",
                  },
                ],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Customer created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CustomerMutationResponse",
                },
              },
            },
          },
          "400": {
            description: "Missing required customer fields",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/customers/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "MongoDB ObjectId of the customer",
          schema: {
            type: "string",
          },
        },
      ],

      get: {
        tags: ["Customers"],
        summary: "Get a customer by ID",
        responses: {
          "200": {
            description: "Customer details and statistics",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CustomerResponse",
                },
              },
            },
          },
          "404": {
            description: "Customer not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NotFoundResponse",
                },
              },
            },
          },
        },
      },

      patch: {
        tags: ["Customers"],
        summary: "Update a customer",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateCustomerInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Customer updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CustomerMutationResponse",
                },
              },
            },
          },
          "404": {
            description: "Customer not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NotFoundResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/services": {
      get: {
        tags: ["Services"],
        summary: "Get all active services",
        responses: {
          "200": {
            description: "List of active services",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ServiceListResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/services/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "MongoDB ObjectId of the service",
          schema: {
            type: "string",
          },
        },
      ],

      get: {
        tags: ["Services"],
        summary: "Get a service by ID",
        responses: {
          "200": {
            description: "Service details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ServiceResponse",
                },
              },
            },
          },
          "404": {
            description: "Service not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NotFoundResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/analytics": {
      get: {
        tags: ["Analytics"],
        summary: "Get operational analytics",
        parameters: [
          {
            name: "period",
            in: "query",
            required: false,
            description:
              "Analytics period. Defaults to week when omitted or when an unsupported value is provided.",
            schema: {
              type: "string",
              enum: ["today", "week", "month"],
              default: "week",
            },
          },
        ],
        responses: {
          "200": {
            description: "Analytics data",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AnalyticsResponse",
                },
              },
            },
          },
        },
      },
    },
  },

  components: {
    schemas: {
      ApiInfoResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          message: {
            type: "string",
          },
          version: {
            type: "string",
          },
          status: {
            type: "string",
          },
        },
        required: [
          "success",
          "message",
          "version",
          "status",
        ],
      },

      HealthResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          message: {
            type: "string",
          },
          timestamp: {
            type: "string",
            format: "date-time",
          },
        },
        required: [
          "success",
          "message",
          "timestamp",
        ],
      },

      BookingStatus: {
        type: "string",
        enum: [
          "Pending",
          "Assigned",
          "Completed",
          "Cancelled",
        ],
      },

      MechanicAvailability: {
        type: "string",
        enum: [
          "Available",
          "Offline",
        ],
      },

      MechanicStatus: {
        type: "string",
        enum: [
          "Available",
          "On Service",
          "Offline",
        ],
      },

      Vehicle: {
        type: "object",
        properties: {
          make: {
            type: "string",
          },
          model: {
            type: "string",
          },
          year: {
            type: "integer",
            minimum: 1900,
          },
          registrationNumber: {
            type: "string",
          },
        },
        required: [
          "make",
          "model",
          "year",
          "registrationNumber",
        ],
      },

      CustomerReference: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          customerId: {
            type: "string",
          },
          name: {
            type: "string",
          },
          phone: {
            type: "string",
          },
          email: {
            type: "string",
          },
        },
      },

      MechanicReference: {
        type: "object",
        nullable: true,
        properties: {
          _id: {
            type: "string",
          },
          mechanicId: {
            type: "string",
          },
          name: {
            type: "string",
          },
          phone: {
            type: "string",
          },
          specialization: {
            type: "string",
          },
          experience: {
            type: "integer",
          },
          rating: {
            type: "number",
          },
          availability: {
            $ref: "#/components/schemas/MechanicAvailability",
          },
        },
      },

      ServiceReference: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          serviceId: {
            type: "string",
          },
          name: {
            type: "string",
          },
          description: {
            type: "string",
          },
          basePrice: {
            type: "number",
          },
          duration: {
            type: "integer",
          },
        },
      },

      Booking: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          bookingId: {
            type: "string",
          },
          customer: {
            $ref: "#/components/schemas/CustomerReference",
          },
          mechanic: {
            $ref: "#/components/schemas/MechanicReference",
          },
          service: {
            $ref: "#/components/schemas/ServiceReference",
          },
          vehicle: {
            $ref: "#/components/schemas/Vehicle",
          },
          date: {
            type: "string",
            format: "date-time",
          },
          time: {
            type: "string",
          },
          amount: {
            type: "number",
            minimum: 0,
          },
          status: {
            $ref: "#/components/schemas/BookingStatus",
          },
          notes: {
            type: "string",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
        required: [
          "_id",
          "bookingId",
          "customer",
          "mechanic",
          "service",
          "vehicle",
          "date",
          "time",
          "amount",
          "status",
        ],
      },

      CreateBookingInput: {
        type: "object",
        properties: {
          customerId: {
            type: "string",
          },
          mechanicId: {
            type: "string",
            nullable: true,
          },
          serviceId: {
            type: "string",
          },
          vehicle: {
            $ref: "#/components/schemas/Vehicle",
          },
          date: {
            type: "string",
            format: "date",
          },
          time: {
            type: "string",
          },
          amount: {
            type: "number",
            minimum: 0,
          },
          status: {
            $ref: "#/components/schemas/BookingStatus",
          },
          notes: {
            type: "string",
          },
        },
        required: [
          "customerId",
          "serviceId",
          "vehicle",
          "date",
          "time",
          "amount",
        ],
      },

      UpdateBookingInput: {
        type: "object",
        properties: {
          customerId: {
            type: "string",
          },
          mechanicId: {
            type: "string",
            nullable: true,
          },
          serviceId: {
            type: "string",
          },
          vehicle: {
            $ref: "#/components/schemas/Vehicle",
          },
          date: {
            type: "string",
            format: "date",
          },
          time: {
            type: "string",
          },
          amount: {
            type: "number",
            minimum: 0,
          },
          status: {
            $ref: "#/components/schemas/BookingStatus",
          },
          notes: {
            type: "string",
          },
        },
      },

      Mechanic: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          mechanicId: {
            type: "string",
          },
          name: {
            type: "string",
          },
          phone: {
            type: "string",
          },
          specialization: {
            type: "string",
          },
          experience: {
            type: "integer",
            minimum: 0,
          },
          rating: {
            type: "number",
            minimum: 0,
            maximum: 5,
          },
          availability: {
            $ref: "#/components/schemas/MechanicAvailability",
          },
          status: {
            $ref: "#/components/schemas/MechanicStatus",
          },
          jobsToday: {
            type: "integer",
            minimum: 0,
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },

      CreateMechanicInput: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          phone: {
            type: "string",
          },
          specialization: {
            type: "string",
          },
          experience: {
            type: "integer",
            minimum: 0,
          },
          rating: {
            type: "number",
            minimum: 0,
            maximum: 5,
          },
          availability: {
            $ref: "#/components/schemas/MechanicAvailability",
          },
        },
        required: [
          "name",
          "phone",
          "specialization",
          "experience",
        ],
      },

      UpdateMechanicInput: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          phone: {
            type: "string",
          },
          specialization: {
            type: "string",
          },
          experience: {
            type: "integer",
            minimum: 0,
          },
          rating: {
            type: "number",
            minimum: 0,
            maximum: 5,
          },
          availability: {
            $ref: "#/components/schemas/MechanicAvailability",
          },
        },
      },

      MechanicWithStats: {
        allOf: [
          {
            $ref: "#/components/schemas/Mechanic",
          },
        ],
      },

      Customer: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          customerId: {
            type: "string",
          },
          name: {
            type: "string",
          },
          phone: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          address: {
            type: "string",
          },
          vehicles: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Vehicle",
            },
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },

      CustomerWithStats: {
        allOf: [
          {
            $ref: "#/components/schemas/Customer",
          },
          {
            type: "object",
            properties: {
              totalBookings: {
                type: "integer",
              },
              completedBookings: {
                type: "integer",
              },
              pendingBookings: {
                type: "integer",
              },
              cancelledBookings: {
                type: "integer",
              },
              totalSpent: {
                type: "number",
              },
            },
          },
        ],
      },

      CreateCustomerInput: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          phone: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          address: {
            type: "string",
          },
          vehicles: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Vehicle",
            },
          },
        },
        required: [
          "name",
          "phone",
          "email",
          "address",
        ],
      },

      UpdateCustomerInput: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          phone: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          address: {
            type: "string",
          },
          vehicles: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Vehicle",
            },
          },
        },
      },

      Service: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          serviceId: {
            type: "string",
          },
          name: {
            type: "string",
          },
          description: {
            type: "string",
          },
          basePrice: {
            type: "number",
            minimum: 0,
          },
          duration: {
            type: "integer",
            minimum: 1,
          },
          active: {
            type: "boolean",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },

      BookingStatusBreakdown: {
        type: "object",
        properties: {
          status: {
            $ref: "#/components/schemas/BookingStatus",
          },
          count: {
            type: "integer",
          },
          percentage: {
            type: "number",
          },
        },
      },

      ServicePerformance: {
        type: "object",
        properties: {
          serviceId: {
            type: "string",
          },
          name: {
            type: "string",
          },
          bookings: {
            type: "integer",
          },
          completedBookings: {
            type: "integer",
          },
          revenue: {
            type: "number",
          },
          averageValue: {
            type: "number",
          },
        },
      },

      MechanicPerformance: {
        type: "object",
        properties: {
          mechanicId: {
            type: "string",
          },
          name: {
            type: "string",
          },
          jobs: {
            type: "integer",
          },
          completedJobs: {
            type: "integer",
          },
          revenue: {
            type: "number",
          },
          rating: {
            type: "number",
          },
          rate: {
            type: "number",
          },
        },
      },

      DailyAnalytics: {
        type: "object",
        properties: {
          date: {
            type: "string",
          },
          bookings: {
            type: "integer",
          },
          completedBookings: {
            type: "integer",
          },
          cancelledBookings: {
            type: "integer",
          },
          revenue: {
            type: "number",
          },
        },
      },

      DashboardOverview: {
        type: "object",
        properties: {
          totalBookings: {
            type: "integer",
          },
          todayBookings: {
            type: "integer",
          },
          completedBookings: {
            type: "integer",
          },
          pendingBookings: {
            type: "integer",
          },
          assignedBookings: {
            type: "integer",
          },
          cancelledBookings: {
            type: "integer",
          },
          totalRevenue: {
            type: "number",
          },
          averageBookingValue: {
            type: "number",
          },
          completionRate: {
            type: "number",
          },
          cancellationRate: {
            type: "number",
          },
          totalCustomers: {
            type: "integer",
          },
          totalMechanics: {
            type: "integer",
          },
          activeMechanics: {
            type: "integer",
          },
          newCustomersThisMonth: {
            type: "integer",
          },
          totalServices: {
            type: "integer",
          },
        },
      },

      DashboardResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          data: {
            type: "object",
            properties: {
              overview: {
                $ref: "#/components/schemas/DashboardOverview",
              },
              bookingStatus: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/BookingStatusBreakdown",
                },
              },
              servicePerformance: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ServicePerformance",
                },
              },
              dailyTrend: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/DailyAnalytics",
                },
              },
            },
          },
        },
      },

      AnalyticsResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          data: {
            type: "object",
            properties: {
              period: {
                type: "string",
                enum: ["today", "week", "month"],
              },
              overview: {
                type: "object",
                properties: {
                  totalBookings: {
                    type: "integer",
                  },
                  todayBookings: {
                    type: "integer",
                  },
                  completedBookings: {
                    type: "integer",
                  },
                  pendingBookings: {
                    type: "integer",
                  },
                  assignedBookings: {
                    type: "integer",
                  },
                  cancelledBookings: {
                    type: "integer",
                  },
                  totalRevenue: {
                    type: "number",
                  },
                  averageBookingValue: {
                    type: "number",
                  },
                  completionRate: {
                    type: "number",
                  },
                  cancellationRate: {
                    type: "number",
                  },
                  totalCustomers: {
                    type: "integer",
                  },
                  newCustomers: {
                    type: "integer",
                  },
                  totalMechanics: {
                    type: "integer",
                  },
                  activeMechanics: {
                    type: "integer",
                  },
                  totalServices: {
                    type: "integer",
                  },
                },
              },
              bookingStatus: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/BookingStatusBreakdown",
                },
              },
              servicePerformance: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ServicePerformance",
                },
              },
              mechanicPerformance: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MechanicPerformance",
                },
              },
              dailyTrend: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/DailyAnalytics",
                },
              },
            },
          },
        },
      },

      BookingResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          data: {
            $ref: "#/components/schemas/Booking",
          },
        },
      },

      BookingListResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          count: {
            type: "integer",
          },
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Booking",
            },
          },
        },
      },

      BookingMutationResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          message: {
            type: "string",
          },
          data: {
            $ref: "#/components/schemas/Booking",
          },
        },
      },

      MechanicResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          data: {
            $ref: "#/components/schemas/MechanicWithStats",
          },
        },
      },

      MechanicListResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          count: {
            type: "integer",
          },
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/MechanicWithStats",
            },
          },
        },
      },

      MechanicMutationResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          message: {
            type: "string",
          },
          data: {
            $ref: "#/components/schemas/MechanicWithStats",
          },
        },
      },

      CustomerResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          data: {
            $ref: "#/components/schemas/CustomerWithStats",
          },
        },
      },

      CustomerListResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          count: {
            type: "integer",
          },
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/CustomerWithStats",
            },
          },
        },
      },

      CustomerMutationResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          message: {
            type: "string",
          },
          data: {
            $ref: "#/components/schemas/CustomerWithStats",
          },
        },
      },

      ServiceResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          data: {
            $ref: "#/components/schemas/Service",
          },
        },
      },

      ServiceListResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          count: {
            type: "integer",
          },
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Service",
            },
          },
        },
      },

      ValidationErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          message: {
            type: "string",
          },
          fields: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },

      NotFoundResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          message: {
            type: "string",
          },
        },
      },
    },
  },
};

export default swaggerDocument;