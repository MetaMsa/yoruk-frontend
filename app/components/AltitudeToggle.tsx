export default function AltitudeToggle({ globeRef }: { globeRef: any }) {
    const toggleAltitude = (toggle: boolean) => {
        if (!globeRef.current) return;

        globeRef.current.pointOfView(
          {
            lat: globeRef.current.pointOfView().lat,    
            lng: globeRef.current.pointOfView().lng,
            altitude: globeRef.current.pointOfView().altitude + (toggle ? -1 : 1)
          },
          1500
        );

        console.log(globeRef.current.pointOfView().altitude);
    }

    return (
        <div className="absolute bottom-45 right-4 z-10 flex flex-col gap-2">
            <button className="btn btn-primary" onClick={() => toggleAltitude(true)}>
                +
            </button>
            <button className="btn btn-primary" onClick={() => toggleAltitude(false)}>
                -
            </button>
        </div>
    );
}