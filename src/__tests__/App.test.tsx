import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

// Silence console messages during tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

// Mock the API calls with proper data structures
jest.mock("../utils", () => ({
  ...jest.requireActual("../utils"),
  SupportedObjectTypes: {
    contacts: "Contact",
    companies: "Company"
  },
  getNativePropertiesWithMappings: jest.fn().mockResolvedValue([]),
  getHubSpotProperties: jest.fn().mockResolvedValue({
    contactProperties: [
      {
        name: "email",
        label: "Email",
        type: "string",
        modificationMetadata: {
          archivable: true,
          readOnlyDefinition: false,
          readOnlyValue: false
        }
      }
    ],
    companyProperties: [
      {
        name: "name",
        label: "Name",
        type: "string",
        modificationMetadata: {
          archivable: true,
          readOnlyDefinition: false,
          readOnlyValue: false
        }
      }
    ]
  }),
  getContactProperties: jest.fn().mockImplementation((props) => props.contactProperties || []),
  getCompanyProperties: jest.fn().mockImplementation((props) => props.companyProperties || [])
}));

describe("App Component", () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders main layout components", () => {
    render(<App />);

    // Check if main sections are present
    expect(screen.getByText("Side Bar Content here")).toBeInTheDocument();
    expect(screen.getByText("Footer Content here")).toBeInTheDocument();
  });

  test("renders tabs with correct labels", () => {
    render(<App />);

    // Check if both tabs are present
    expect(screen.getByRole("tab", { name: /contact/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /company/i })).toBeInTheDocument();
  });

  test("switches between tabs correctly", async () => {
    render(<App />);
    const user = userEvent.setup();

    // Get tabs
    const contactTab = screen.getByRole("tab", { name: /contact/i });
    const companyTab = screen.getByRole("tab", { name: /company/i });

    // Click company tab
    await user.click(companyTab);
    expect(companyTab).toHaveAttribute("aria-selected", "true");
    expect(contactTab).toHaveAttribute("aria-selected", "false");

    // Click contact tab
    await user.click(contactTab);
    expect(contactTab).toHaveAttribute("aria-selected", "true");
    expect(companyTab).toHaveAttribute("aria-selected", "false");
  });

  test("renders MappingContainer with correct props", () => {
    render(<App />);

    // Check if the default tab panel is present
    const tabPanel = screen.getByRole("tabpanel");
    expect(tabPanel).toBeInTheDocument();
    expect(tabPanel).toBeVisible();

    // Verify it has the correct aria-labelledby attribute
    expect(tabPanel).toHaveAttribute("aria-labelledby", "simple-tab-0");
  });

  test("grid layout has correct structure", () => {
    render(<App />);

    // Check if grid containers exist with correct IDs
    expect(screen.getByTestId("sideBarContainer")).toBeInTheDocument();
    expect(screen.getByTestId("bodyContainer")).toBeInTheDocument();
    expect(screen.getByTestId("footerContainer")).toBeInTheDocument();
  });
});
