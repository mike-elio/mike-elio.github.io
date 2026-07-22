import { useState } from "react";

export function PortraitOrbit() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="portrait-orbit-wrap">
      <span aria-hidden="true" className="orbit orbit--outer">
        <i />
      </span>
      <span aria-hidden="true" className="orbit orbit--inner">
        <i />
      </span>
      <div className="portrait-frame">
        <span aria-hidden="true" className="portrait-fallback">
          ME
        </span>
        {!failed ? (
          <img
            alt="Mike Eliovits"
            fetchPriority="high"
            height="400"
            onError={() => setFailed(true)}
            src="/assets/profile.jpg"
            width="400"
          />
        ) : null}
      </div>
    </div>
  );
}
