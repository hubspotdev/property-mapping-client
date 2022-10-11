import { Button } from "@mui/material";
import { useEffect, useState } from "react";

function Header() {
  const [installUrl, setInstallUrl] = useState("");
  useEffect(() => {
    async function getInstallUrl() {
      const response = await fetch("/api/install");
      const url = await response.text();
      setInstallUrl(url);
    }
    getInstallUrl();
  }, []);

  return <Button href={installUrl}>Install</Button>;
}

export default Header;
