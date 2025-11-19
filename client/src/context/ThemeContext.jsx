import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext({
  currentTheme: "",
  setCurrentTheme: () => {},
  theme: {
    light: {
      bgColor: "",
      textColor: "",
      cardBg: "",
      borderColor: "",
      navbarBg: "",
      inputBg: "",
      buttonBg: "",
      buttonText: "",
    },
    dark: {
      bgColor: "",
      textColor: "",
      cardBg: "",
      borderColor: "",
      navbarBg: "",
      inputBg: "",
      buttonBg: "",
      buttonText: "",
    },
  },
});

export default function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setCurrentTheme,
        theme: {
          light: {
            bgColor: "bg-white",
            textColor: "text-gray-900",
            cardBg: "bg-gray-100",
            borderColor: "border-gray-300",
            navbarBg: "bg-white border-gray-200",
            inputBg: "bg-white border-gray-300 text-gray-900",
            buttonBg: "bg-blue-600 hover:bg-blue-700",
            buttonText: "text-white",
          },
          dark: {
            bgColor: "bg-gray-900",
            textColor: "text-white",
            cardBg: "bg-gray-800",
            borderColor: "border-gray-700",
            navbarBg: "bg-gray-800 border-gray-700",
            inputBg: "bg-gray-700 border-gray-600 text-white",
            buttonBg: "bg-blue-500 hover:bg-blue-600",
            buttonText: "text-white",
          },
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
