import { useState, useRef } from 'react';

import {
  Box,
  Menu,
  IconButton,
  Button,
  ListItemText,
  ListItem,
  List,
  Typography,
  styled
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import RestoreFromTrashTwoToneIcon from '@mui/icons-material/RestoreFromTrashTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

function BulkActions({handleBulkDelete, handleBulkRestore}) {
  const [onMenuOpen, menuOpen] = useState(false);
  const moreRef = useRef(null);
  const { t } = useTranslation();

  const openMenu = () => {
    menuOpen(true);
  };

  const closeMenu = () => {
    menuOpen(false);
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Typography variant="h5" color="text.secondary">
            {t('Bulk actions')}:
          </Typography>
            <Button
            onClick={handleBulkRestore}
            startIcon={<RestoreFromTrashTwoToneIcon />}
            variant="contained"
            >
                {t('Restore')}
            </Button>
          <ButtonError
              onClick={handleBulkDelete}
            sx={{
              ml: 1
            }}
            startIcon={<DeleteForeverTwoToneIcon />}
            variant="contained"
          >
            {t('Delete')}
          </ButtonError>
        </Box>
        <IconButton
          color="primary"
          onClick={openMenu}
          ref={moreRef}
          sx={{
            ml: 2,
            p: 1
          }}
        >
          <MoreVertTwoToneIcon />
        </IconButton>
      </Box>
      <Menu
        disableScrollLock
        keepMounted
        anchorEl={moreRef.current}
        open={onMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
      >
        <List
          sx={{
            p: 1
          }}
          component="nav"
        >
          <ListItem button>
            <ListItemText primary={t('Bulk delete selected')} />
          </ListItem>
          <ListItem button>
            <ListItemText primary={t('Resend email notification')} />
          </ListItem>
        </List>
      </Menu>
    </>
  );
}

export default BulkActions;
