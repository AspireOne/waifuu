import { PropsWithChildren, useEffect, useRef } from "react";

import { useMountPersistence } from "@providers/MountPersistenceProvider";

/** When you wrap a component with this wrapper, it will be portalled to the root of the DOM and preserved
 * through remounts (e.g. it's state will persist even when you navigate away from the component).
 *
 * Use this only when truly necessary. */
export const Persisted = (props: PropsWithChildren<{ id: string }>) => {
  const { id, children } = props;
  const { getPortalElement } = useMountPersistence();
  const keepAliveRef = useRef<HTMLDivElement>(null);

  const appendPortalElement = () => {
    if (keepAliveRef.current) {
      const portalElement = getPortalElement(id, children);
      keepAliveRef.current.appendChild(portalElement);
    }
  };

  useEffect(() => {
    appendPortalElement();
  }, [appendPortalElement]);

  return <div ref={keepAliveRef} />;
};
