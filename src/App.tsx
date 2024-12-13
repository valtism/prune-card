import { useRef, useState } from "react";
import Background from "./assets/background.svg";
import PruneLogo from "./assets/prune-logo-inverted-rgb.svg?react";
import Mastercard from "./assets/mastercard.svg?react";
import EmvChip from "./assets/emv-chip.svg?react";
import EyeIcon from "./assets/eye.svg?react";
import EyeSlashIcon from "./assets/eye-slash.svg?react";

export default function App() {
  return (
    <div className="p-4">
      <Card
        name="Dan Wood"
        number="1234 5678 9012 3456"
        expiration="1224"
        cvv="123"
      />
    </div>
  );
}

const enterExitDuration = 250;

interface CardProps {
  name: string;
  number: string;
  expiration: string;
  cvv: string;
}
function Card({ name, number, expiration, cvv }: CardProps) {
  const [show, setShow] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="group relative inline-flex items-center justify-center p-4"
      style={{
        perspective: "1000px",
      }}
      onMouseEnter={() => {
        setTimeout(() => {
          cardRef.current?.style.setProperty(
            "transition-property",
            "translate, box-shadow",
          );
        }, enterExitDuration);
      }}
      onMouseMove={(e) => {
        const { left, top, width, height } =
          e.currentTarget.getBoundingClientRect();

        // X and Y values are between -1 and 1, with 0 being the center
        const x = (e.clientX - left - width / 2) / (width / 2);
        const y = (e.clientY - top - height / 2) / (height / 2);

        const cardBounds = cardRef.current?.getBoundingClientRect();
        if (!cardBounds) {
          return;
        }
        const posX = e.clientX - cardBounds.left;
        const posY = e.clientY - cardBounds.top;

        e.currentTarget.style.setProperty("--shine-x", `${posX}px`);
        e.currentTarget.style.setProperty("--shine-y", `${posY}px`);
        e.currentTarget.style.setProperty("--rotate-x", `${y * 14}deg`);
        e.currentTarget.style.setProperty("--rotate-y", `${-x * 14}deg`);
        e.currentTarget.style.setProperty("--rotate-z", `${(x - y) * 1}deg`);
      }}
      onMouseLeave={(e) => {
        cardRef.current?.style.setProperty(
          "transition-property",
          "translate, box-shadow, transform",
        );

        e.currentTarget.style.setProperty("--rotate-x", "0deg");
        e.currentTarget.style.setProperty("--rotate-y", "0deg");
        e.currentTarget.style.setProperty("--rotate-z", "0deg");
      }}
    >
      <div
        ref={cardRef}
        className="bg-prune-950 border-t-prune-700 border-l-prune-600 border-r-prune-800 border border-b-black shadow-indigo-900/20 group-hover:translate-z-10 group-hover:shadow-lg"
        style={{
          width: "85.60mm",
          height: "53.98mm",
          borderRadius: "3mm",
          transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          transitionDuration: `${enterExitDuration}ms`,
          transformStyle: "preserve-3d",
          transform:
            "rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) rotateZ(var(--rotate-z))",
        }}
      >
        <div
          className="absolute size-full"
          style={{
            backgroundImage: `url("${Background}")`,
            backgroundRepeat: "repeat-y",
            backgroundPosition: "-40px -30px",
            backgroundSize: "240px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
        <div className="relative flex size-full flex-col items-start justify-end gap-2 p-4 text-white">
          <PruneLogo className="absolute top-3 right-4 h-6" />
          <div className="absolute right-6 bottom-16 flex items-center justify-center overflow-clip rounded-lg bg-zinc-500">
            <EmvChip className="h-8 p-px" />
            <div
              className="pointer-events-none absolute rounded-full bg-white/40 blur-xl"
              style={{
                width: 93,
                height: 62,
                left: -260 - 93 / 2,
                top: -110 - 62 / 2,
                transform:
                  "translateX(var(--shine-x)) translateY(var(--shine-y))",
              }}
            />
          </div>
          <div>{name}</div>
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-1 grid-rows-1">
              <div className="col-start-1 row-start-1 ml-auto tabular-nums">
                {show ? (
                  number
                ) : (
                  <>
                    <RedactedNumbers count={4} /> <RedactedNumbers count={4} />{" "}
                    <RedactedNumbers count={4} /> {number.slice(-4)}
                  </>
                )}
              </div>
              <div className="invisible col-start-1 row-start-1 tabular-nums">
                <>
                  <RedactedNumbers count={4} /> <RedactedNumbers count={4} />{" "}
                  <RedactedNumbers count={4} /> <RedactedNumbers count={4} />
                </>
              </div>
            </div>
            <button
              onPointerDown={() => setShow(!show)}
              className="rounded p-1 hover:bg-white/20 hover:active:bg-white/30"
            >
              {show ? (
                <EyeIcon className="size-4" />
              ) : (
                <EyeSlashIcon className="size-4" />
              )}
            </button>
          </div>
          <div className="flex gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-prune-300 text-xs tracking-widest uppercase">
                Exp
              </span>
              <span className="tabular-nums">
                {expiration.match(/.{1,2}/g)?.join(" / ")}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-prune-300 text-xs tracking-widest uppercase">
                CCV
              </span>
              <span className="tabular-nums">
                {show ? cvv : <RedactedNumbers count={3} />}
              </span>
            </div>
          </div>
          <Mastercard className="absolute right-4 bottom-3 h-6" />
          <div
            className="pointer-events-none absolute top-0 left-0 rounded-full bg-white/50 blur-3xl"
            style={{
              width: 93,
              height: 62,
              left: -100 / 2,
              top: -60 / 2,
              transform:
                "translateX(var(--shine-x)) translateY(var(--shine-y))",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function RedactedNumbers({ count = 1 }: { count?: number }) {
  const arr = Array(count).fill(0);
  return (
    <span>
      {arr.map((_, i) => (
        <span className="redact" key={i}>
          0
        </span>
      ))}
    </span>
  );
}
