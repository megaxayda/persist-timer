import { useTimer } from "react-timer-hook";
import "./timer.css";
import { useEffect, useState } from "react";
import addSeconds from "date-fns/addSeconds";
import Modal from "react-modal";
import { useLocalStorage } from "react-use";
import InputTime from "./InputTime";

const customStyles = {
  content: {
    top: "40%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const getLeadingZero = (num) => (Number(num) < 10 ? "0" + num : num);

export default function Timer({ name, deleteTimer, id }) {
  const [duration, setDuration, removeDuration] = useLocalStorage(
    id + "_duration",
    2 * 60
  );
  const [endTime, setEndTime, removeEndTime] = useLocalStorage(
    id + "_endTime",
    addSeconds(new Date(), 2 * 60).valueOf()
  );
  const [timerName, setTimerName, removeTimerName] = useLocalStorage(
    id + "_timerName",
    `Timer ${name || 0}`
  );
  const [modalIsOpen, setIsOpen] = useState(false);
  const [hoursInput, setHoursInput] = useState(0);
  const [minsInput, setMinsInput] = useState(0);
  const [secsInput, setSecsInput] = useState(0);

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    // start,
    // pause,
    // resume,
    restart,
  } = useTimer({
    expiryTimestamp: new Date(endTime),
    onExpire: () => {
      const audio = new Audio("/small-bell-ring-01a.wav");
      audio.play();
    },
    autoStart: true,
  });

  function openModal() {
    setIsOpen(true);
  }

  const restartToExpiryTime = () => {
    const startTime = new Date();
    const endTime = addSeconds(startTime, duration);
    setEndTime(endTime.valueOf());

    restart(addSeconds(startTime, duration));
  };

  const onChangeHours = (e) => {
    setHoursInput(e.target.value);
  };

  const onChangeMinutes = (e) => {
    setMinsInput(e.target.value);
  };

  const onChangeSecs = (e) => {
    setSecsInput(e.target.value);
  };

  const onChangeName = (e) => {
    setTimerName(e.target.value);
  };

  const onSaveEdit = () => {
    const newDuration =
      Number(hoursInput) * 60 * 60 + Number(minsInput) * 60 + Number(secsInput);
    const endTime = addSeconds(new Date(), newDuration);

    setDuration(newDuration);
    setEndTime(endTime.valueOf());

    setIsOpen(false);

    restart(endTime);
  };

  const onClickDelete = () => {
    deleteTimer(id);
  };

  useEffect(() => {
    return () => {
      removeDuration();
      removeEndTime();
      removeTimerName();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Modal isOpen={modalIsOpen} style={customStyles}>
        <div className="modal">
          <h2 style={{ marginBottom: 40 }}>Edit timer</h2>
          <div className="inputContainer">
            <div className="inputField">
              <InputTime
                value={hoursInput}
                onChange={onChangeHours}
              ></InputTime>
              <span>Hrs</span>
            </div>
            <span className="divider">:</span>
            <div className="inputField">
              <InputTime
                value={minsInput}
                onChange={onChangeMinutes}
              ></InputTime>
              <span>Mins</span>
            </div>
            <span className="divider">:</span>
            <div className="inputField">
              <InputTime value={secsInput} onChange={onChangeSecs}></InputTime>
              <span>Secs</span>
            </div>
          </div>

          <hr style={{ margin: "30px 0" }}></hr>

          <div className="inputFieldText">
            <span>Timer name</span>
            <input
              type="text"
              className="text"
              value={timerName}
              onChange={onChangeName}
            ></input>
          </div>

          <div className="footer">
            <button className="deleteButton" onClick={onClickDelete}>
              Delete timer
            </button>
            <button className="doneButton" onClick={onSaveEdit}>
              Done
            </button>
          </div>
        </div>
      </Modal>
      <div>
        <div className="mainTimer">
          <div className={"timer"}>
            <span>{getLeadingZero(days)}</span>:
            <span>{getLeadingZero(hours)}</span>:
            <span>{getLeadingZero(minutes)}</span>:
            <span>{getLeadingZero(seconds)}</span>
          </div>

          <button className="controlButton reset" onClick={restartToExpiryTime}>
            Reset
          </button>

          {!isRunning && <h2 className={"doneText"}>DONE</h2>}
        </div>
        <div>
          <span style={{ fontSize: 18 }}>{timerName}</span>

          <button
            className="subControlButton"
            style={{ color: "#556bb5" }}
            onClick={openModal}
          >
            Edit
          </button>
          <button
            className="subControlButton"
            style={{ color: "#d0021b" }}
            onClick={onClickDelete}
          >
            Remove
          </button>
        </div>
      </div>
      <hr></hr>
    </>
  );
}
