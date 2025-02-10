import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import MappingContainer from '../MappingContainer'
import { SupportedObjectTypes } from '../../utils'

// Silence console messages during tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  jest.restoreAllMocks()
})

// Mock the fetch calls
global.fetch = jest.fn()

// Mock dependencies
jest.mock('../MappingDisplay', () => ({
  __esModule: true,
  default: () => <div data-testid="mapping-display">Mapping Display</div>
}))

jest.mock('../PropertyEditor', () => ({
  __esModule: true,
  default: () => <div data-testid="property-editor">Property Editor</div>
}))

// Mock utils
jest.mock('../../utils', () => {
  const originalModule = jest.requireActual('../../utils')
  return {
    ...originalModule,
    getContactProperties: jest.fn().mockReturnValue([]),
    getCompanyProperties: jest.fn().mockReturnValue([]),
    shapeProperties: jest.fn(props => props),
    checkHubspotProperties: jest.fn().mockResolvedValue(true),
    getHubSpotProperties: jest.fn().mockResolvedValue({
      contactProperties: [],
      companyProperties: []
    }),
    SupportedObjectTypes: {
      contacts: 'Contact',
      companies: 'Company'
    }
  }
})

describe('MappingContainer', () => {
  const mockProps = {
    objectType: SupportedObjectTypes.contacts,
    setDisplaySnackBar: jest.fn(),
    setSnackbarMessage: jest.fn()
  }

  const mockNativeProperties = [
    {
      property: {
        name: 'test',
        label: 'Test',
        type: 'string',
        object: SupportedObjectTypes.contacts,
        modificationMetadata: {
          archivable: true,
          readOnlyDefinition: false,
          readOnlyValue: false
        }
      },
      mapping: {
        nativeName: 'test',
        hubspotLabel: 'Test',
        hubspotName: 'test',
        id: 1,
        object: SupportedObjectTypes.contacts,
        direction: 'toHubSpot',
        customerId: '123',
        modificationMetadata: {
          archivable: true,
          readOnlyDefinition: false,
          readOnlyValue: false
        }
      }
    }
  ]

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    // Setup default fetch mock responses with proper headers
    ;(global.fetch as jest.Mock)
      .mockImplementation((url: string) => {
        const mockResponse = {
          ok: true,
          headers: new Headers({
            'content-type': 'application/json'
          }),
          json: () => {
            if (url === '/api/native-properties-with-mappings') {
              return Promise.resolve(mockNativeProperties)
            }
            if (url === '/api/hubspot-properties') {
              return Promise.resolve({
                contactProperties: [],
                companyProperties: []
              })
            }
            if (url === '/api/check-hubspot-properties') {
              return Promise.resolve({ valid: true })
            }
            return Promise.reject(new Error('Not found'))
          }
        }
        return Promise.resolve(mockResponse)
      })
  })

  it('shows loading state initially', async () => {
    // Don't resolve the fetch promise immediately
    ;(global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))

    render(<MappingContainer {...mockProps} />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('fetches and displays property mappings', async () => {
    await act(async () => {
      render(<MappingContainer {...mockProps} />)
    })

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
      expect(screen.getByTestId('mapping-display')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    render(<MappingContainer {...mockProps} />)

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled()
    })

    consoleError.mockRestore()
  })

  it('toggles property editor drawer', async () => {
    await act(async () => {
      render(<MappingContainer {...mockProps} />)
    })

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
    })

    // Find button by role and partial text match
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(button)
    })
    expect(screen.getByTestId('property-editor')).toBeInTheDocument()

    // Click again to close
    await act(async () => {
      fireEvent.click(button)
    })
    await waitFor(() => {
      expect(screen.queryByTestId('property-editor')).not.toBeInTheDocument()
    })
  })

  it('filters properties by object type correctly', async () => {
    const mixedProperties = [
      ...mockNativeProperties,
      {
        property: {
          ...mockNativeProperties[0].property,
          object: SupportedObjectTypes.companies
        }
      }
    ]

    ;(global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mixedProperties)
      })
    )

    render(<MappingContainer {...mockProps} />)

    await waitFor(() => {
      // Should only show one mapping display for contacts
      const mappingDisplays = screen.getAllByTestId('mapping-display')
      expect(mappingDisplays).toHaveLength(1)
    })
  })
})
