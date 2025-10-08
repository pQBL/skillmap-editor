import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Test component that uses useTheme
function TestComponent() {
  const { theme } = useTheme()
  return <div data-testid="theme-display">{theme}</div>
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should provide theme context to children', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('theme-display')).toHaveTextContent('light')
    })
  })

  it('should throw error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useTheme must be used within a ThemeProvider')

    spy.mockRestore()
  })

  it('should toggle theme when toggle button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <TestComponent />
        <ThemeToggle />
      </ThemeProvider>
    )

    // Wait for component to mount
    await waitFor(() => {
      expect(screen.getByTestId('theme-display')).toHaveTextContent('light')
    })

    // Find and click the toggle button
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(toggleButton)

    // Check that theme changed to dark
    await waitFor(() => {
      expect(screen.getByTestId('theme-display')).toHaveTextContent('dark')
    })

    // Click again to toggle back
    await user.click(toggleButton)

    // Check that theme changed back to light
    await waitFor(() => {
      expect(screen.getByTestId('theme-display')).toHaveTextContent('light')
    })
  })

  it('should persist theme to localStorage', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    // Wait for mount
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
    })

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(toggleButton)

    // Check localStorage was updated
    await waitFor(() => {
      expect(localStorageMock.getItem('theme')).toBe('dark')
    })
  })

  it('should load saved theme from localStorage on mount', async () => {
    // Set a saved theme
    localStorageMock.setItem('theme', 'dark')

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Should load the saved theme
    await waitFor(() => {
      expect(screen.getByTestId('theme-display')).toHaveTextContent('dark')
    })
  })
})
