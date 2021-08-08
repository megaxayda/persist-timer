import { useTimer } from "react-timer-hook";
import "./timer.css";
import cx from "classnames";
import { useEffect, useState } from "react";
import addSeconds from "date-fns/addSeconds";
import Modal from "react-modal";
import { useLocalStorage } from "react-use";
import differenceInSeconds from "date-fns/differenceInSeconds";

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

export default function Timer({ endTime, onExpire }) {
  const {
    seconds,
    minutes,
    hours,
    // days,
    isRunning,
    start,
    // pause,
    // resume,
    restart,
  } = useTimer({
    expiryTimestamp: new Date(endTime),
    onExpire: () => onExpire && onExpire(),
    autoStart: true,
  });

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const onClickStart = () => {
    const startTime = new Date();
    const endTime = addSeconds(startTime, duration);
    setStartTime(startTime.valueOf());
    setEndTime(endTime.valueOf());

    start();
  };

  const restartToExpiryTime = () => {
    const startTime = new Date();
    const endTime = addSeconds(startTime, duration);
    setStartTime(startTime.valueOf());
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
    const startTime = new Date();
    const endTime = addSeconds(startTime, duration);

    setDuration(newDuration);
    setStartTime(startTime.valueOf());
    setEndTime(endTime.valueOf());

    setIsOpen(false);

    restart(addSeconds(startTime, duration));
  };

  const onClickDelete = () => {
    deleteTimer(id);
  };

  useEffect(() => {
    return () => {
      removeDuration();
      removeStartTime();
      removeEndTime();
    };
  }, []);

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="modal">
          <h2 style={{ marginBottom: 40 }}>Edit timer</h2>
          <div className="inputContainer">
            <div className="inputField">
              <input
                type="number"
                value={hoursInput}
                onChange={onChangeHours}
              ></input>
              <span>Hrs</span>
            </div>
            <span className="divider">:</span>
            <div className="inputField">
              <input
                type="number"
                value={minsInput}
                onChange={onChangeMinutes}
              ></input>
              <span>Mins</span>
            </div>
            <span className="divider">:</span>
            <div className="inputField">
              <input
                type="number"
                value={secsInput}
                onChange={onChangeSecs}
              ></input>
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
            <span>{getLeadingZero(hours)}</span>:
            <span>{getLeadingZero(minutes)}</span>:
            <span>{getLeadingZero(seconds)}</span>
          </div>

          {!isRunning && (
            <button className={"controlButton start"} onClick={onClickStart}>
              Start
            </button>
          )}

          <button className="controlButton reset" onClick={restartToExpiryTime}>
            Reset
          </button>
        </div>
        <div>
          <span style={{ fontSize: 18 }}>
            {timerName} ({duration})
          </span>

          <button
            className="subControlButton"
            style={{ color: "#556bb5" }}
            onClick={openModal}
          >
            Edit
          </button>
          {/* <button className="subControlButton" style={{ color: "#d0021b" }}>
            Remove
          </button> */}
        </div>
      </div>
      <hr></hr>
    </>
  );
}
