import { useEffect, useState } from "react";
import { Booth } from "../types/Booth";
import { useParams } from "react-router-dom";
import _booth from "../services/BoothService";
import _theme from "../services/ThemeService";
import { usePage } from "../hooks/Context";
import LoadingPage from "./LoadingPage";
import { Theme } from "../types/Theme";
import { errorHandler } from "../hooks/ErrorHandler";
import InvalidPage from "./InvalidPage";
import BackButton from "../components/BackButton";
import { Overflow } from "../components/Overflow";

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
  const [ isFetchingTheme, setIsFetchingTheme ] = useState<boolean>(true);
  const statusArray = ["Active", "Warning", "Error"];

  useEffect(() => {
    const fetch = async () => {
      if(isFetchingBooth) {
        _booth.get(id)
          .then(response => {
            console.log(response);
            if(response[0] && response[0].id === id) setBooth(response[0]);
            else setIsInvalid(true);
          }).catch(error => {
              handleError(error);
          }).finally(() => {
            setIsFetchingBooth(false);
          })
      }
      else if(isFetchingTheme) {
        _theme.get(booth?.themeId)
          .then(response => {
            if(response[0].id === booth?.themeId) setTheme(response[0]);
          }).catch(error => {
              handleError(error);
          }).finally(() => {
            setIsFetchingTheme(false);
            setIsFetching(false);
          })
        }
    };
    fetch();
  }, [isFetchingBooth, isFetchingTheme]);

  if(isFetching) {
    return <LoadingPage />;
  }

  if(isInvalid) {
    return <InvalidPage />;
  }

  return (
    <>
      <Overflow height="calc(100vh - 90px)">
        <BackButton />
      </Overflow>
    </>
  )
}

export default BoothDetailPage;
