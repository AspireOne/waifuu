import React, { ReactNode, createContext, useContext, useState } from "react";
import ReactDOM from "react-dom";

// Define the shape of the nodes state
interface NodeEntry {
  children: ReactNode;
  element: HTMLElement;
}

interface Nodes {
  [id: string]: NodeEntry;
}

// Define the context shape
interface AliveScopeContextProps {
  getPortalElement: (id: string, children: ReactNode) => HTMLElement;
}

// Create the context with an initial dummy value
const AliveScopeContext = createContext<AliveScopeContextProps | undefined>(undefined);

// Define the props for the AliveScope component
interface AliveScopeProps {
  children: ReactNode;
}

export const MountPersistenceProvider: React.FC<AliveScopeProps> = ({ children }) => {
  const [nodes, setNodes] = useState<Nodes>({});

  const getPortalElement = (id: string, children: ReactNode): HTMLElement => {
    if (!nodes[id]) {
      const element = document.createElement("div");
      setNodes((prevNodes) => ({
        ...prevNodes,
        [id]: { children, element },
      }));
      return element;
    }

    // biome-ignore lint: it is checked above.
    return nodes[id]!.element;
  };

  return (
    <AliveScopeContext.Provider
      value={{
        getPortalElement,
      }}
    >
      {children}
      {Object.entries(nodes).map(([id, { children, element }]) => (
        <React.Fragment key={id}>{ReactDOM.createPortal(children, element)}</React.Fragment>
      ))}
    </AliveScopeContext.Provider>
  );
};

export const useMountPersistence = (): AliveScopeContextProps => {
  const context = useContext(AliveScopeContext);
  if (!context) {
    throw new Error("this use hook must be used within a provider.");
  }
  return context;
};
