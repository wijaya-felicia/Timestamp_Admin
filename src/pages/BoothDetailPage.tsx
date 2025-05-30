import { useEffect, useState } from "react";
import { Booth } from "../types/Booth";
import { useNavigate, useParams } from "react-router-dom";
import _booth from "../services/BoothService";
import _theme from "../services/ThemeService";
import _frame from "../services/FrameService";
import { usePage, usePopup } from "../hooks/Context";
import LoadingPage from "./LoadingPage";
import { Theme } from "../types/Theme";
import { errorHandler } from "../hooks/ErrorHandler";
import InvalidPage from "./InvalidPage";
import BackButton from "../components/BackButton";
import { Overflow, OverflowX } from "../components/Overflow";
import { BoothLog } from "../types/Log";
import { unixToDate } from "../utils/TimeConverter";
import EditButton from "../components/EditButton";
import { Frame } from "../types/Frame";
import { ConfirmPopup } from "../components/Popup";

const BoothDetailPage: React.FC = () => {
  const { setPage } = usePage();
  setPage("Booths");
  const { showPopup, hidePopup } = usePopup();
  const { handleError } = errorHandler();
  const navigate = useNavigate();

  const { id } = useParams();
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const [booth, setBooth] = useState<Booth | undefined>(undefined);
  const [isFetchingBooth, setIsFetchingBooth] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [logs, setLogs] = useState<BoothLog[]>([]);
  const statusArray = ["Error", "Warning", "Active", "Active", "Active"];

  useEffect(() => {
    const fetch = async () => {
      if (isFetchingBooth) {
        _booth
          .get(id)
          .then((response) => {
            if (response[0] && response[0].id === id) setBooth(response[0]);
            else setIsInvalid(true);
          })
          .catch((error) => {
            handleError(error);
          })
          .finally(() => {
            setIsFetchingBooth(false);
          });
        _booth
          .getLogs(null, id)
          .then((response) => {
            setLogs(response.reverse());
          })
          .catch((error) => {
            handleError(error);
          });
        _frame
          .get(null, null, null, null, id)
          .then((response) => {
            setFrames(response);
          })
          .catch((error) => {
            handleError(error);
          });
      } else {
        _theme
          .get(booth?.themeId)
          .then((response) => {
            if (response[0].id === booth?.themeId) setTheme(response[0]);
          })
          .catch((error) => {
            handleError(error);
          })
          .finally(() => {
            setIsFetching(false);
          });
      }
    };
    fetch();
  }, [isFetchingBooth]);

  const destroy = () => {
    showPopup(
      <>
        <ConfirmPopup
          message="Are you sure you want to delete this booth?"
          onConfirm={async () => {
            if (id) {
              await _booth
                .delete(id)
                .then(() => {
                  hidePopup();
                  navigate("/booths", { replace: true });
                })
                .catch((error) => {
                  handleError(error);
                });
            } else hidePopup();
          }}
          onCancel={() => {
            hidePopup();
          }}
        />
      </>,
    );
  };

  if (isFetching) {
    return <LoadingPage />;
  }

  if (isInvalid) {
    return <InvalidPage />;
  }

  return (
    <>
      <Overflow height="calc(100vh - 90px)">
        <div className="p-3">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center justify-content-start gap-3">
                <BackButton />
                <h3 className="text-white mb-0 fw-bold">{booth?.name}</h3>
              </div>
              <a className="btn btn-danger" onClick={destroy}>
                Delete Booth
              </a>
            </div>
            <div className="d-flex align-items-center justify-content-start flex-wrap gap-3">
              <span
                className={"px-3 py-1 rounded-pill text-white ".concat(
                  booth?.status! >= 2
                    ? "bg-success"
                    : booth?.status == 1
                      ? "bg-warning"
                      : "bg-danger",
                )}
              >
                {statusArray[booth?.status ?? 0]}
              </span>
              <span className="px-3 py-1 rounded-pill text-white text-nowrap bg-quaternary">
                Server Key : {booth?.serverKey}
              </span>
              <span className="px-3 py-1 rounded-pill text-white text-nowrap bg-quaternary">
                Client Key : {booth?.clientKey}
              </span>
            </div>
            <div className="d-flex flex-column align-items-start justify-content-center gap-2">
              <h4 className="text-white mb-0">Description</h4>
              <p className="text-white fs-5">{booth?.description}</p>
            </div>
          </div>
          <hr />
          <div className="d-flex flex-column gap-3">
            <div className="d-flex gap-3 align-items-stretch">
              <div className="flex-grow-1" style={{ minWidth: "40%" }}>
                <div className="card bg-tertiary">
                  <div className="card-body">
                    <h3 className="text-bold text-nowrap text-white">
                      Theme : {theme?.name}
                    </h3>
                    <hr />
                    <div className="d-flex align-items-center">
                      <img src={theme?.url} className="img-fluid rounded-3" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-grow-1" style={{ minWidth: "40%" }}>
                <div className="card bg-tertiary">
                  <div className="card-body">
                    <h3 className="text-bold text-nowrap text-white">
                      Booth Logs
                    </h3>
                    <hr />
                    <Overflow height="calc(100vh - 444px)">
                      <table className="table p-0">
                        <tbody>
                          {logs.map((log) => (
                            <tr key={log.id}>
                              <td className="bg-tertiary">
                                <span
                                  className={"d-flex align-items-center justify-content-center py-1 rounded-pill text-white ".concat(
                                    log?.level >= 2
                                      ? "bg-success"
                                      : log?.level == 1
                                        ? "bg-warning"
                                        : "bg-danger",
                                  )}
                                  style={{ width: "80px" }}
                                >
                                  {statusArray[log.level]}
                                </span>
                              </td>
                              <td className="text-white bg-tertiary">
                                {log.message}
                              </td>
                              <td className="text-muted text-nowrap bg-tertiary">
                                {unixToDate(log.timestamp)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Overflow>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex card bg-tertiary">
              <div className="card-body">
                <h3 className="text-bold text-nowrap text-white">Frames</h3>
                <hr />
                <OverflowX width="calc(100vw - 215px)">
                  <div className="d-flex w-100 align-items-stretch">
                    {frames.map((frame) => (
                      <div key={frame.id} className="col-2 px-3">
                        <img
                          src={frame.url}
                          className="w-100 object-fit-contain"
                          style={{
                            filter: "drop-shadow(0px 0px 5px #222)",
                            height: "200px",
                          }}
                        />
                        <h5 className="text-center text-white mt-2">
                          {frame.name}
                        </h5>
                      </div>
                    ))}
                  </div>
                </OverflowX>
              </div>
            </div>
          </div>
        </div>
      </Overflow>
      <EditButton />
    </>
  );
};

export default BoothDetailPage;
