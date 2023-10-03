

const Stopwatch = ({ time }) => {
  //   const hours = Math.floor(time / 360000);
  //   const minutes = Math.floor((time % 360000) / 6000);
  //   const seconds = Math.floor((time % 6000) / 100);
  //   //   const seconds = Math.floor(time / 1000) % 60;
  //   const milliseconds = time % 100;

  const seconds = time % 60;
  const minutes = Math.floor(time / 60) % 60;

  // Method to start and stop timer
  //   const startAndStop = () => {
  //     setIsRunning(!isRunning);
  //   };

  //   // Method to reset timer back to 0
  //   const reset = () => {
  //     setTime(0);
  //   };

  return (
    <div className="stopwatch-container">
      <p className="stopwatch-time">
        {/* {hours}:{minutes.toString().padStart(2, "0")}: */}
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
        {/* {milliseconds.toString().padStart(2, "0")} */}
      </p>
    </div>
  );
};

export default Stopwatch;
