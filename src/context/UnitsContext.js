import { createContext, useContext } from "react";
import PropTypes from "prop-types";

// Context setup
const UnitsContext = createContext();

function UnitsProvider({ children, imperialUnits, setImperialUnits }) {
  return (
    <UnitsContext.Provider value={{ imperialUnits, setImperialUnits }}>
      {children}
    </UnitsContext.Provider>
  );
}

// Units provider
function useUnits() {
  const context = useContext(UnitsContext);
  if (!context) {
    throw new Error("useUnits must be used within a UnitsProvider");
  }
  return context;
}

// Props typechecking
UnitsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  imperialUnits: PropTypes.bool.isRequired,
  setImperialUnits: PropTypes.func.isRequired,
};

// Export context and functions
export { UnitsProvider, useUnits };
