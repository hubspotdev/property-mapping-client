import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyEditor from '../components/PropertyEditor';
import { SupportedObjectTypes } from '../utils';

describe('PropertyEditor', () => {
  const mockProps = {
    onNewPropertyCreate: jest.fn(),
    setNativePropertiesWithMappings: jest.fn(),
    nativePropertiesWithMappings: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        headers: new Headers(),
        json: () => Promise.resolve({}),
      } as Response)
    );
  });

  it('renders all form fields correctly', () => {
    render(<PropertyEditor {...mockProps} />);

    expect(screen.getByLabelText(/label/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    // For Select components, look for their labels directly
    expect(screen.getByText(/property type/i)).toBeInTheDocument();
    expect(screen.getByText(/object type/i)).toBeInTheDocument();
    expect(screen.getByText(/enforce uniquness/i)).toBeInTheDocument();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });

  it('updates property name based on label input', async () => {
    render(<PropertyEditor {...mockProps} />);

    const labelInput = screen.getByLabelText(/label/i);
    await userEvent.type(labelInput, 'Test Property!');

    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toHaveValue('Test_Property_');
  });

  it('shows error alert when submitting with missing fields', async () => {
    render(<PropertyEditor {...mockProps} />);

    const submitButton = screen.getByText(/submit/i);
    await userEvent.click(submitButton);

    expect(screen.getByText(/missing information needed/i)).toBeInTheDocument();
  });

  it('successfully creates a new property', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      ok: true,
      headers: new Headers(),
      json: () => Promise.resolve({})
    } as Response);

    render(<PropertyEditor {...mockProps} />);

    // Fill out the form
    await userEvent.type(screen.getByLabelText(/label/i), 'Test Property');

    const propertyTypeSelect = screen.getByRole('combobox', { name: /property type/i });
    fireEvent.mouseDown(propertyTypeSelect);
    const stringOption = screen.getByText('String');
    fireEvent.click(stringOption);

    // Use ID for object type select since it doesn't have a proper label association
    const objectTypeSelect = screen.getByRole('combobox', { name: '' });
    fireEvent.mouseDown(objectTypeSelect);
    const firstObjectType = screen.getByText(capitalizeFirstLetter(Object.keys(SupportedObjectTypes)[0]));
    fireEvent.click(firstObjectType);

    // Click checkbox
    const uniqueCheckbox = screen.getByRole('checkbox', { name: /enforce uniquness/i });
    fireEvent.click(uniqueCheckbox);

    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/native-properties/',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );

    expect(mockProps.setNativePropertiesWithMappings).toHaveBeenCalled();
    expect(mockProps.onNewPropertyCreate).toHaveBeenCalledWith(false);
  });

  it('handles API failure gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 500
    });

    render(<PropertyEditor {...mockProps} />);

    // Fill out form minimally
    await userEvent.type(screen.getByLabelText(/label/i), 'Test Property');

    const propertyTypeSelect = screen.getByRole('combobox', { name: /property type/i });
    fireEvent.mouseDown(propertyTypeSelect);
    const stringOption = screen.getByText('String');
    fireEvent.click(stringOption);

    const objectTypeSelect = screen.getByRole('combobox', { name: '' });
    fireEvent.mouseDown(objectTypeSelect);
    const firstObjectType = screen.getByText(capitalizeFirstLetter(Object.keys(SupportedObjectTypes)[0]));
    fireEvent.click(firstObjectType);

    // Submit form
    await userEvent.click(screen.getByText(/submit/i));

    expect(mockProps.setNativePropertiesWithMappings).not.toHaveBeenCalled();
    expect(mockProps.onNewPropertyCreate).not.toHaveBeenCalled();
  });
});

// Helper function to match the one in your component
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
