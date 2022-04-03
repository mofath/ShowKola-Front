import { Box } from '@mui/material';
import HeaderNotifications from './Notifications';
import LanguageSwitcher from './LanguageSwitcher';
import Chat from './Chat';
import ThemeSwitcher from "./ThemeSwitcher";

function HeaderButtons() {
  return (
    <Box>
      <HeaderNotifications />
      <LanguageSwitcher />
      <ThemeSwitcher />
    </Box>
  );
}

export default HeaderButtons;
