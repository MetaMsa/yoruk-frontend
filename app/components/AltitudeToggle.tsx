export default function AltitudeToggle({ globeRef }: { globeRef: any }) {
    const reduceAltitude = () => {
        if (!globeRef.current || globeRef.current.pointOfView().altitude <= 1) return;

        globeRef.current.pointOfView(
            {
                lat: globeRef.current.pointOfView().lat,
                lng: globeRef.current.pointOfView().lng,
                altitude: globeRef.current.pointOfView().altitude - 1
            },
            1500
        );
    }

    const increaseAltitude = () => {
        if (!globeRef.current || globeRef.current.pointOfView().altitude >= 10) return;
        globeRef.current.pointOfView(
            {
                lat: globeRef.current.pointOfView().lat,
                lng: globeRef.current.pointOfView().lng,
                altitude: globeRef.current.pointOfView().altitude + 1
            },
            1500
        );
    }

    return (
        <div className="absolute bottom-22 left-2 z-10 flex flex-col gap-2">
            <button className="btn btn-outline" onClick={() => reduceAltitude()}>
                +
            </button>
            <button className="btn btn-outline" onClick={() => increaseAltitude()}>
                -
            </button>
        </div>
    );
}