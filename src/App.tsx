import { useRef, useState } from "react";
import Background from "./assets/background.svg";

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
        // @ts-expect-error Custom CSS properties
        "--shine-x": "0px",
        "--shine-y": "0px",
        "--rotate-x": "0deg",
        "--rotate-y": "0deg",
        "--rotate-z": "0deg",
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
          transitionProperty: "translate, box-shadow",
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
            <EmvChipIcon className="h-8 p-px" />
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
          <div
            className="font-bold"
            style={{
              textShadow: "text-shadow: 2px 2px 0px #000",
            }}
          >
            {name}
          </div>
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
                <EyeClosedIcon className="size-4" />
              )}
            </button>
          </div>
          <div className="flex gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-prune-300 text-xs font-semibold tracking-widest uppercase">
                Exp
              </span>
              <span className="tabular-nums">
                {expiration.match(/.{1,2}/g)?.join(" / ")}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-prune-300 text-xs font-bold tracking-widest uppercase">
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

const PruneLogo = (props: React.SVGAttributes<SVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 4962.877 1060.368"
    {...props}
  >
    <path
      d="m1981.027 176.34-358.53-.547h-10.81v726.916h164.55V636.036h198.91c129.22 0 223-96.922 223-230.395s-91.31-228.89-217.12-229.301Zm-45.72 314.86h-159.21l-.82-170.435h160.03c22.18 0 94.73 6.16 94.73 85.013 0 54.347-34.5 85.423-94.73 85.423ZM2876.086 773.472c-4.38-93.91-22.45-193.981-178.24-198.362v-12.184c107.88-17.248 174.41-86.791 174.41-183.303 0-116.224-93.36-203.837-217.12-203.837h-374.27v726.916h167.42V632.606h93.37c119.78 0 142.64 23.957 147.3 91.584l11.77 168.929.68 10.13h10.13l159.62-.547h11.37l-.55-11.363-5.89-117.867Zm-171.94-369.755c0 52.978-30.12 77.62-94.73 77.62h-161.13l-.41-160.58h161.54c62.83 0 94.73 27.928 94.73 82.96ZM3431.717 175.786h-10.82v364.963c0 134.569-55.44 211.64-152.22 211.64-84.88 0-137.45-56.948-137.45-148.805V175.786h-166.46v427.798c0 180.155 112.25 305.962 273.11 305.962 96.1 0 161.94-45.86 182.07-126.217h11.36v118.414h165.09V175.786h-164.68ZM4197.457 175.793h-10.82V708.18h-14.23c-4.79-28.885-12.87-45.586-20.81-61.877l-1.37-2.874-229.85-461.75-3.01-6.023h-199.18v725.958h150.31V402.766h13.42c4.38 21.219 12.86 37.373 20.53 51.747 1.92 3.559 3.7 7.118 5.48 10.54l209.31 430.674 3.01 6.024h216.98V175.793h-139.77ZM4952.057 175.786h-491.59v725.957h502.41v-163.59h-340.87v-125.26h336.9V455.737h-336.9V340.334h340.87V175.786h-10.82Z"
      style={{
        fill: "#f4f4f3",
      }}
    />
    <path
      d="m981.481 451.325 348.396-.022v149.638c-410.342 104.054-432.09 459.215-432.09 459.215l-86.065.211v-438.62C457.659 764.548 430.25 1059.952 430.25 1059.952l-85.658.414V601.373L0 601.307V451.325C405.733 344.41 430.216.019 430.216.019l86.581-.001v434.994C862.269 312.668 897.827 0 897.827 0l85.693.017-2.038 451.308Z"
      style={{
        fill: "#ff9b43",
      }}
    />
  </svg>
);

const Mastercard = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.448 25" {...props}>
    <path
      d="M14.755 2.672h10.938v19.655H14.755z"
      style={{
        fill: "#ff5f00",
        strokeWidth: 0,
      }}
    />
    <path
      d="M15.45 12.5c0-3.987 1.867-7.539 4.774-9.828A12.446 12.446 0 0 0 12.499 0C5.596 0 0 5.596 0 12.5S5.596 25 12.5 25c2.915 0 5.598-.999 7.724-2.672A12.478 12.478 0 0 1 15.45 12.5Z"
      style={{
        fill: "#eb001b",
        strokeWidth: 0,
      }}
    />
    <path
      d="M40.448 12.5c0 6.903-5.596 12.5-12.499 12.5-2.916 0-5.599-.999-7.725-2.672 2.907-2.29 4.774-5.84 4.774-9.828s-1.867-7.539-4.774-9.828A12.446 12.446 0 0 1 27.949 0c6.903 0 12.5 5.596 12.5 12.5Z"
      style={{
        fill: "#f79e1b",
        strokeWidth: 0,
      }}
    />
  </svg>
);

const EmvChipIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="2641.21 10043.39 54717.58 39913.22"
    {...props}
  >
    <path d="m2772.62 30000-64.37-6166.53-.2.01c-6.94-125.14-13.21-249.08-19.09-372.31-17.72-45.21-27.47-94.43-27.47-145.92 0-38.81 5.55-76.32 15.86-111.81-190.84-4534.18 360.83-7757.06 1981.5-9890.04 1714.54-2256.53 4573.28-3258.68 8950.3-3258.68v1.56l16390.81-12.89 16390.81 12.89v-1.56c4377.03 0 7235.76 1002.15 8950.3 3258.68 1694.77 2230.5 2220.66 5652.7 1950.8 10520.08l-.2-.01-64.37 6166.53 64.37 6166.53.2-.01c269.86 4867.38-256.03 8289.58-1950.8 10520.08-1714.54 2256.52-4573.27 3258.68-8950.3 3258.68v-1.56l-13179.7 10.36-7.19.01-3203.92 2.52-16390.81-12.89v1.56c-4377.02 0-7235.76-1002.16-8950.3-3258.68-1619.25-2131.11-2171.38-5350.22-1982.02-9878.14-9.99-34.97-15.34-71.89-15.34-110.06 0-50.74 9.48-99.27 26.71-143.93 6.06-128.32 12.62-257.52 19.85-387.95l.2.01 64.37-6166.53zm27278.29-17337.55c529.3 0 1008.54 214.58 1355.45 561.49 346.91 346.91 561.49 826.15 561.49 1355.45 0 529.29-214.58 1008.53-561.49 1355.45-346.91 346.91-826.15 561.49-1355.45 561.49-529.29 0-1008.53-214.58-1355.45-561.49-346.91-346.92-561.49-826.16-561.49-1355.45 0-529.3 214.58-1008.54 561.49-1355.45 346.92-346.91 826.16-561.49 1355.45-561.49zm789.83 1127.11c-202.09-202.09-481.37-327.11-789.83-327.11-308.46 0-587.73 125.01-789.83 327.11-202.09 202.09-327.11 481.37-327.11 789.83 0 308.46 125.01 587.73 327.11 789.83 202.1 202.1 481.37 327.11 789.83 327.11 308.46 0 587.73-125.01 789.83-327.11 202.1-202.1 327.11-481.37 327.11-789.83 0-308.46-125.02-587.74-327.11-789.83zm8506.71 2926.53c74.21 207.1-33.52 435.17-240.62 509.38-207.1 74.21-435.17-33.52-509.38-240.62-593.53-1642.8-1384.65-3199.23-2401.08-4340.44-829.84-931.72-1808.64-1581.61-2949.59-1760.34-44.99-6.96-87.04-21.22-125.16-41.35l-3121.66-2.45-2671.19 2.1c-38.3 20.32-80.57 34.7-125.82 41.7-1806.72 283.03-3206.53 1744.94-4253.49 3642.78-1525.96 2766.1-2292.32 6433.51-2493.12 8837.69-30.6 366.45-8.78 710.53 67.27 1077.04 78.72 379.39 216.69 791.38 415.27 1280.92 140.99 347.58 342.76 719.53 551.64 1104.6 515.77 950.79 1072.1 1976.55 1049.84 3195.88 22.26 1219.33-534.07 2245.09-1049.84 3195.88-208.88 385.07-410.65 757.02-551.64 1104.6-198.58 489.54-336.55 901.53-415.27 1280.92-76.05 366.51-97.87 710.58-67.27 1077.04 200.8 2404.18 967.16 6071.59 2493.12 8837.69 1041.89 1888.65 2433.28 3345.4 4227.33 3638.4l2823.17 2.22 3174.47-2.5c1793.25-293.63 3184.11-1750.05 4225.68-3638.12 1525.96-2766.1 2292.32-6433.51 2493.12-8837.69 30.61-366.47 8.78-710.54-67.27-1077.04-78.71-379.39-216.69-791.38-415.27-1280.92-140.18-345.59-334.52-705.93-536.64-1080.71-520.77-965.61-1089.59-2020.34-1064.74-3311.02 27.21-1413.16 603.17-2322.98 1126.65-3149.91 365.83-577.89 702.51-1109.72 740.51-1713.25 31.9-506.66 202.67-1175.75 772.12-1641.82 393.55-322.11 967.14-536.48 1799.01-510.31v-1.19h14287.73c153.4-4211.46-361.58-7189.78-1828.64-9120.59-1546.84-2035.81-4204.04-2939.94-8315.92-2939.94v-1.56l-11065.21-8.7c532.68 336.9 1021.11 767.29 1467.69 1268.69 1087.56 1221.07 1927.98 2869.66 2554.2 4602.94zM25053.93 49155.84c-1128.49-736.85-2055.52-1894.7-2804.47-3252.35-1513.96-2744.35-2307.57-6324.85-2557.55-8805.09H3464.12c-151.78 4204.22 363.64 7178.23 1829.11 9106.94 1546.84 2035.8 4204.05 2939.94 8315.92 2939.94v1.56l11444.78 9zM19644.18 36298.4c4.77-282.65 37.28-563.05 98.17-856.52 90.15-434.45 241.25-889.23 455.91-1418.42 160.5-395.67 371.11-783.92 589.14-1185.86 469.66-865.8 976.4-1799.98 955.98-2806.81v-15.62c20.41-1006.82-486.32-1941.01-955.98-2806.81-218.03-401.94-428.64-790.19-589.14-1185.86-214.66-529.19-365.77-983.98-455.91-1418.42-63.21-304.66-95.83-595.23-98.59-888.85l-1.68.02H3500.97c1.34 24.86 2.58 49.53 3.96 74.47v18.75c43.5 4167.51 43.5 8215.55 0 12383.06v18.75c-1.64 29.51-3.11 58.72-4.69 88.12h16143.94zm50.69-13379.68c253.2-2479.1 1046.47-6042.49 2554.59-8776.25 764.73-1386.24 1715.09-2564.21 2876.03-3298.37l-11516.34 9.06v1.56c-4111.87 0-6769.08 904.13-8315.92 2939.94-1467.06 1930.8-1982.04 4909.13-1828.64 9120.59h16177.49c17.9 0 35.51 1.2 52.79 3.47zm36804.08 796.53H42247.6l-12.5-1.56c-617.33-21.14-1020.49 119.2-1280.25 331.82-352.47 288.48-460.05 732.42-481.5 1073.06-50.76 806.15-439.73 1420.59-862.39 2088.25-467.53 738.54-981.93 1551.12-1004.77 2737.41-20.82 1081.39 496.95 2041.46 970.98 2920.4 214.07 396.95 419.9 778.59 574.14 1158.83 214.67 529.2 365.78 983.98 455.91 1418.42 60.89 293.47 93.41 573.87 98.18 856.52h15794.28c-1.58-29.4-3.05-58.61-4.69-88.12v-18.75c-43.5-4167.51-43.5-8215.55 0-12383.06v-18.75c1.38-24.94 2.62-49.61 3.96-74.47zm36.85 13383.15H40657.66c-249.98 2480.24-1043.59 6060.74-2557.55 8805.09-748.86 1357.48-1675.75 2515.21-2804.04 3252.08l11094.7-8.73v-1.56c4111.88 0 6769.08-904.14 8315.92-2939.94 1465.46-1928.72 1980.92-4902.69 1829.11-9106.94z" />
  </svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m15 18-.722-3.25" />
    <path d="M2 8a10.645 10.645 0 0 0 20 0" />
    <path d="m20 15-1.726-2.05" />
    <path d="m4 15 1.726-2.05" />
    <path d="m9 18 .722-3.25" />
  </svg>
);
