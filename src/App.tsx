import { Card, CardFace } from "./Card";

export default function App() {
  return (
    <div>
      <div className="h-[1000px] p-4">
        <Card
          name="Dan Ashcroft"
          number="1234 5678 9012 3456"
          expiration="1224"
          cvv="123"
        />
      </div>
      <div className="bg-prune-970 relative h-[2000px] isolate">
        <div className="sticky top-0 flex flex-col items-center text-7xl font-bold text-white">
          <div className="text-prune-orange pt-12">Introducing</div>
          <div className="perspective-distant invisible">
            <Card3D />
          </div>
          <div className="z-10 text-center -mt-6">
            <div>
              <span className="text-prune-orange">the</span> Prune
            </div>
            <div>account</div>
          </div>
        </div>
        {/* <div className="sticky top-20 mx-auto flex justify-center perspective-distant">
          <Card3D />
        </div> */}
      </div>
      <div className="h-[1000px] bg-stone-100" />
    </div>
  );
}

function Card3D() {
  return (
    <div className="my-animation text-base">
      <CardFace
        name="Dan Ashcroft"
        number="1234 5678 9012 3456"
        expiration="1224"
        cvv="123"
      />
      <div className="bg-prune-950" />
      {/* Right */}
      <div className="bg-prune-900" />
      {/* Left */}
      <div className="bg-prune-900" />
      {/* Top */}
      <div className="bg-prune-900" />
      {/* Bottom */}
      <div className="bg-prune-900" />
    </div>
  );
}
