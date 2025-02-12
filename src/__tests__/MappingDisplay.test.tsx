import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MappingDisplay from '../components/MappingDisplay';
import { Direction, Property, PropertyWithMapping } from '../utils';

// Mock fetch globally
global.fetch = jest.fn();

const mockHubspotProperties: Property[] = [
  {
    name: 'firstname',
    label: 'First Name',
    type: 'string',
    object: 'contact',
    modificationMetadata: {
      readOnlyValue: false,
      readOnlyDefinition: false,
      archivable: true
    }
  },
  {
    name: 'lastname',
    label: 'Last Name',
    type: 'string',
    object: 'contact',
    modificationMetadata: {
      readOnlyValue: true,
      readOnlyDefinition: false,
      archivable: true
    }
  }
];

const mockNativePropertyWithMapping: PropertyWithMapping = {
  property: {
    name: 'first_name',
    label: 'First Name',
    type: 'string',
    object: 'contact',
    modificationMetadata: {
      readOnlyValue: false,
      readOnlyDefinition: false,
      archivable: true
    }
  },
  mapping: {
    id: 1,
    customerId: '123',
    nativeName: 'first_name',
    hubspotName: 'firstname',
    hubspotLabel: 'First Name',
    object: 'contact',
    direction: Direction.toHubSpot,
    modificationMetadata: {
      readOnlyValue: false,
      readOnlyDefinition: false,
      archivable: true
    }
  }
};

describe('MappingDisplay', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    jest.clearAllMocks();
  });

  it('renders the component with initial mapping', () => {
    render(
      <MappingDisplay
        nativePropertyWithMapping={mockNativePropertyWithMapping}
        hubspotProperties={mockHubspotProperties}
      />
    );

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /hubspot contact properties/i })).toBeInTheDocument();
  });

  it('prevents mapping to read-only HubSpot property when direction is toHubSpot', async () => {
    render(
      <MappingDisplay
        nativePropertyWithMapping={mockNativePropertyWithMapping}
        hubspotProperties={mockHubspotProperties}
      />
    );

    // Get the autocomplete by its label
    const autocomplete = screen.getByLabelText('HubSpot contact Properties');
    fireEvent.mouseDown(autocomplete);

    // Wait for the options to appear
    await waitFor(() => {
      const lastNameOption = screen.getByText('Last Name');
      expect(lastNameOption.closest('li')).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('saves mapping when a property is selected', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockNativePropertyWithMapping.mapping }),
    });

    render(
      <MappingDisplay
        nativePropertyWithMapping={mockNativePropertyWithMapping}
        hubspotProperties={mockHubspotProperties}
      />
    );

    const autocomplete = screen.getByRole('combobox', { name: /hubspot contact properties/i });
    fireEvent.click(autocomplete);

    const firstNameOption = screen.getByText('First Name');
    fireEvent.click(firstNameOption);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/mappings', expect.any(Object));
    });
  });

  it('deletes mapping when property is cleared', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockNativePropertyWithMapping.mapping }),
    });

    render(
      <MappingDisplay
        nativePropertyWithMapping={mockNativePropertyWithMapping}
        hubspotProperties={mockHubspotProperties}
      />
    );

    // Find the clear button by its aria-label
    const clearButton = screen.getByLabelText('Clear');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/mappings/${mockNativePropertyWithMapping.mapping!.id}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});
