import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        status: {
          success: "hsl(var(--success))",
          warning: "hsl(var(--warning))",
          info: "hsl(var(--info))",
          danger: "hsl(var(--destructive))"
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        Base: "var(--base)",
        Secondary: "var(--Secondary)",
        SecondaryAccent: "var(--secondary-accent)",
        Text: "var(--text-color)",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))"
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))"
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))"
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))"
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },
      borderRadius: {
        xs: "calc(var(--radius) - 6px)",
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)"
      },
      spacing: {
        "space-2xs": "0.25rem",
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem"
      },
      fontSize: {
        "text-caption": ["0.75rem", { lineHeight: "1rem", fontWeight: "500" }],
        "text-body": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }],
        "text-subtitle": ["1rem", { lineHeight: "1.5rem", fontWeight: "600" }],
        "text-title": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "700" }],
        "text-display": ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }]
      },
      boxShadow: {
        "elevation-1":
          "0 1px 2px 0 hsl(var(--shadow) / 0.06), 0 1px 1px 0 hsl(var(--shadow) / 0.04)",
        "elevation-2":
          "0 4px 8px -2px hsl(var(--shadow) / 0.08), 0 2px 4px -2px hsl(var(--shadow) / 0.05)",
        "elevation-3":
          "0 12px 24px -8px hsl(var(--shadow) / 0.12), 0 4px 8px -4px hsl(var(--shadow) / 0.08)",
        card: "0 1px 3px 0 hsl(var(--shadow) / 0.1), 0 1px 2px 0 hsl(var(--shadow) / 0.06)",
        "card-hover":
          "0 4px 6px -1px hsl(var(--shadow) / 0.1), 0 2px 4px -1px hsl(var(--shadow) / 0.06)",
        dropdown:
          "0 10px 15px -3px hsl(var(--shadow) / 0.1), 0 4px 6px -2px hsl(var(--shadow) / 0.05)",
        sm: "0 1px 2px 0 hsl(var(--shadow) / 0.05)",
        DEFAULT: "0 1px 3px 0 hsl(var(--shadow) / 0.1), 0 1px 2px -1px hsl(var(--shadow) / 0.1)",
        md: "0 4px 6px -1px hsl(var(--shadow) / 0.1), 0 2px 4px -2px hsl(var(--shadow) / 0.1)",
        lg: "0 10px 15px -3px hsl(var(--shadow) / 0.1), 0 4px 6px -4px hsl(var(--shadow) / 0.1)",
        xl: "0 20px 25px -5px hsl(var(--shadow) / 0.1), 0 8px 10px -6px hsl(var(--shadow) / 0.1)"
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0"
          },
          to: {
            height: "var(--radix-accordion-content-height)"
          }
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)"
          },
          to: {
            height: "0"
          }
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      }
    }
  },
  extend: {
    container: {},
    keyframes: {
      fadeIn: {
        "0%": { opacity: "0", transform: "translateY(-20px)" },
        "100%": { opacity: "1", transform: "translateY(0)" }
      }
    },
    animation: {
      fadeIn: "fadeIn 0.5s ease-out forwards"
    }
  },
  plugins: [require("tailwindcss-animate")]
};
export default config;
