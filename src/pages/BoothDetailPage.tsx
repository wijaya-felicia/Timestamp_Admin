import { useEffect, useState } from "react";
import { Booth } from "../types/Booth";
import { useParams } from "react-router-dom";
import _booth from "../services/BoothService";
import _theme from "../services/ThemeService";
import _frame from "../services/FrameService";
import { usePage } from "../hooks/Context";
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

const BoothDetailPage: React.FC = () => {
  const { setPage } = usePage();
  setPage("Booths");
  const { handleError } = errorHandler();

  const { id } = useParams();
  const [ isInvalid, setIsInvalid] = useState<boolean>(false);
  const [ isFetching, setIsFetching] = useState<boolean>(true);

  const [ booth, setBooth ] = useState<Booth | undefined>(undefined);
  const [ isFetchingBooth, setIsFetchingBooth ] = useState<boolean>(true);
  const [ theme, setTheme ] = useState<Theme | undefined>(undefined);
  const [ frames, setFrames ] = useState<Frame[]>([]);
  const [ logs, setLogs ] = useState<BoothLog[]>([]);
  const statusArray = ["Active", "Warning", "Error"];

  useEffect(() => {
    const fetch = async () => {
      if(isFetchingBooth) {
        _booth.get(id)
          .then(response => {
            if(response[0] && response[0].id === id) setBooth(response[0]);
            else setIsInvalid(true);
          }).catch(error => {
              handleError(error);
          }).finally(() => {
            setIsFetchingBooth(false);
          })
      }
      else {
        await _theme.get(booth?.themeId)
          .then(response => {
            if(response[0].id === booth?.themeId) setTheme(response[0]);
          }).catch(error => {
              handleError(error);
          })
        await _frame.get(null, null, null, null, id)
         .then(response => {
            setFrames(response);
          }).catch(error => {
              handleError(error);
          })
        _booth.getLogs(null, id)
          .then(response => {
            console.log(response);
            setLogs(response.reverse());
          }).catch(error => {
              handleError(error);
          }).finally(() => {
            setIsFetching(false);
          })
        }
    };
    fetch();
  }, [isFetchingBooth]);

  if(isFetching) {
    return <LoadingPage />;
  }

  if(isInvalid) {
    return <InvalidPage />;
  }

  return (
    <>
      <Overflow height="calc(100vh - 90px)">
        <div className="p-3">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-start gap-3">
              <BackButton />
              <h3 className="text-white mb-0 fw-bold">{booth?.name}</h3>
            </div>
            <div className="d-flex align-items-center justify-content-start flex-wrap gap-3">
              <span
                  className={"px-3 py-1 rounded-pill text-white ".concat(
                      booth?.status == 0
                      ? "bg-success"
                      : booth?.status == 1
                      ? "bg-warning"
                      : "bg-danger"
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
              <div className="flex-grow-1" style={{minWidth: "40%"}}>
                <div className="card bg-tertiary">
                  <div className="card-body">
                    <h3 className="text-bold text-nowrap text-white">Theme : {theme?.name}</h3>
                    <hr />
                    <div className="d-flex align-items-center">
                      <img src={theme?.url} className="img-fluid rounded-3"/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-grow-1" style={{minWidth: "40%"}}>
                <div className="card bg-tertiary">
                  <div className="card-body">
                      <h3 className="text-bold text-nowrap text-white">Booth Logs</h3>
                      <hr />
                      <Overflow height="calc(100vh - 444px)">
                          <ul className="list-group list-group-flush">
                              {logs.map(log => (
                                  <li key={log.id} className="list-group-item bg-tertiary d-flex justify-content-between align-items-center gap-3">
                                      <div className="d-flex align-items-center gap-4">
                                        <span
                                            className={"d-flex align-items-center justify-content-center py-1 rounded-pill text-white ".concat(
                                                log?.level == 0
                                                ? "bg-success"
                                                : log?.level == 1
                                                ? "bg-warning"
                                                : "bg-danger"
                                            )} style={{width: "80px"}}
                                            >
                                            {statusArray[log.level]}
                                        </span>
                                        <span className="fs-6">{log.message}</span>
                                      </div>
                                      <span className="fs-6 text-muted text-nowrap">{unixToDate(log.timestamp)}</span>
                                  </li>
                              ))}
                          </ul>
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
                    {frames.map(frame => (
                      <div key={frame.id} className="col-2 px-3">
                        <img src={frame.url} className="w-100 object-fit-contain rounded-3"/>
                        <h5 className="text-center text-white">{frame.name}</h5>
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
  )
}

export default BoothDetailPage;
