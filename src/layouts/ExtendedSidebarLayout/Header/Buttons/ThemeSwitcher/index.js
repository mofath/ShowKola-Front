import {useContext, useRef, useState} from 'react';
import {
    alpha,
    Badge,
    Box,
    Divider,
    IconButton,
    Popover,
    useTheme,
    styled, Typography, Stack, Tooltip
} from '@mui/material';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import { useTranslation } from 'react-i18next';
import {Brightness6} from "@mui/icons-material";
import CheckTwoToneIcon from "@mui/icons-material/CheckTwoTone";
import {ThemeContext} from "../../../../../theme/ThemeProvider";

const ThemeToggleWrapper = styled(Box)(
    ({ theme }) => `
          padding: ${theme.spacing(2)};
          min-width: 220px;
  `
);

const ButtonWrapper = styled(Box)(
    ({ theme }) => `
        cursor: pointer;
        position: relative;
        border-radius: ${theme.general.borderRadiusXl};
        padding: ${theme.spacing(0.8)};
        display: flex;
        flex-direction: row;
        align-items: stretch;
        min-width: 80px;
        box-shadow: 0 0 0 2px ${theme.colors.primary.lighter};

        &:hover {
            box-shadow: 0 0 0 2px ${theme.colors.primary.light};
        }

        &.active {
            box-shadow: 0 0 0 2px ${theme.palette.primary.main};

            .colorSchemeWrapper {
                opacity: .6;
            }
        }
  `
);

const IconButtonWrapper = styled(IconButton)(
    ({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  border-radius: ${theme.general.borderRadiusLg};
`
);

const CheckSelected = styled(Box)(
    ({ theme }) => `
    background: ${theme.palette.success.main};
    border-radius: 50px;
    height: 26px;
    width: 26px;
    color: ${theme.palette.success.contrastText};
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -13px 0 0 -13px;
    z-index: 5;

    .MuiSvgIcon-root {
        height: 16px;
        width: 16px;
    }

  `
);

const ColorSchemeWrapper = styled(Box)(
    ({ theme }) => `

    position: relative;

    border-radius: ${theme.general.borderRadiusXl};
    height: 28px;
    
    &.colorSchemeWrapper {
        display: flex;
        align-items: stretch;
        width: 100%;

        .primary {
            border-top-left-radius: ${theme.general.borderRadiusXl};
            border-bottom-left-radius: ${theme.general.borderRadiusXl};
        }

        .secondary {
            border-top-right-radius: ${theme.general.borderRadiusXl};
            border-bottom-right-radius: ${theme.general.borderRadiusXl};
        }

        .primary,
        .secondary,
        .alternate {
            flex: 1;
        }
    }

    &.pureLight {
        .primary {
            background: #5569ff;
        }
    
        .secondary {
            background: #f2f5f9;
        }
    }

    &.greyGoose {
        .primary {
            background: #2442AF;
        }
    
        .secondary {
            background: #F8F8F8;
        }
    }
    
    &.purpleFlow {
        .primary {
            background: #9b52e1;
        }
    
        .secondary {
            background: #00b795;
        }
    }
    
    &.nebulaFighter {
        .primary {
            background: #8C7CF0;
        }
    
        .secondary {
            background: #070C27;
        }
    }

    &.greenFields {
        .primary {
            background: #44a574;
        }
    
        .secondary {
            background: #141c23;
        }
    }

    &.darkSpaces {
        .primary {
            background: #CB3C1D;
        }
    
        .secondary {
            background: #1C1C1C;
        }
    }

  `
);

const  ThemeSwitcher = () => {
    const ref = useRef(null);
    const [isOpen, setOpen] = useState(false);
    const { t } = useTranslation();
    const displayTheme = useTheme();


    const setThemeName = useContext(ThemeContext);
    const curThemeName = localStorage.getItem('appTheme') || 'PureLightTheme';

    const [theme, setTheme] = useState(curThemeName);

    const changeTheme = (theme) => {
        setTheme(theme);
        setThemeName(theme);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
                <Badge
                    variant="dot"
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    sx={{
                        '.MuiBadge-badge': {
                            background: displayTheme.colors.success.main,
                            animation: 'pulse 1s infinite',
                            transition: `${displayTheme.transitions.create(['all'])}`
                        }
                    }}
                >
                    <IconButtonWrapper
                        sx={{
                            background: alpha(displayTheme.colors.primary.main, 0.1),
                            transition: `${displayTheme.transitions.create(['background'])}`,
                            color: displayTheme.colors.primary.main,

                            '&:hover': {
                                background: alpha(displayTheme.colors.primary.main, 0.2)
                            }
                        }}
                        color="primary"
                        ref={ref}
                        onClick={handleOpen}
                    >
                        <Brightness6 fontSize="small" />
                    </IconButtonWrapper>
                </Badge>
            <Popover
                disableScrollLock
                anchorEl={ref.current}
                onClose={handleClose}
                open={isOpen}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                >
                    <ThemeToggleWrapper>
                        <Typography
                            sx={{
                                mt: 1,
                                mb: 3,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                            }}
                            variant="body1"
                        >
                            Light color schemes
                        </Typography>
                        <Stack alignItems="center" spacing={2}>
                            <Tooltip placement="left" title="Pure Light" arrow>
                                <ButtonWrapper
                                    className={theme === 'PureLightTheme' ? 'active' : ''}
                                    onClick={() => {
                                        changeTheme('PureLightTheme');
                                    }}
                                >
                                    {theme === 'PureLightTheme' && (
                                        <CheckSelected>
                                            <CheckTwoToneIcon />
                                        </CheckSelected>
                                    )}
                                    <ColorSchemeWrapper className="colorSchemeWrapper pureLight">
                                        <Box className="primary" />
                                        <Box className="secondary" />
                                    </ColorSchemeWrapper>
                                </ButtonWrapper>
                            </Tooltip>
                            <Tooltip placement="left" title="Grey Goose" arrow>
                                <ButtonWrapper
                                    className={theme === 'GreyGooseTheme' ? 'active' : ''}
                                    onClick={() => {
                                        changeTheme('GreyGooseTheme');
                                    }}
                                >
                                    {theme === 'GreyGooseTheme' && (
                                        <CheckSelected>
                                            <CheckTwoToneIcon />
                                        </CheckSelected>
                                    )}
                                    <ColorSchemeWrapper className="colorSchemeWrapper greyGoose">
                                        <Box className="primary" />
                                        <Box className="secondary" />
                                    </ColorSchemeWrapper>
                                </ButtonWrapper>
                            </Tooltip>
                            <Tooltip placement="left" title="Purple Flow" arrow>
                                <ButtonWrapper
                                    className={theme === 'PurpleFlowTheme' ? 'active' : ''}
                                    onClick={() => {
                                        changeTheme('PurpleFlowTheme');
                                    }}
                                >
                                    {theme === 'PurpleFlowTheme' && (
                                        <CheckSelected>
                                            <CheckTwoToneIcon />
                                        </CheckSelected>
                                    )}
                                    <ColorSchemeWrapper className="colorSchemeWrapper purpleFlow">
                                        <Box className="primary" />
                                        <Box className="secondary" />
                                    </ColorSchemeWrapper>
                                </ButtonWrapper>
                            </Tooltip>
                        </Stack>
                    </ThemeToggleWrapper>
                    <ThemeToggleWrapper>
                        <Typography
                            sx={{
                                mt: 1,
                                mb: 3,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                            }}
                            variant="body1"
                        >
                            Dark color schemes
                        </Typography>
                        <Stack alignItems="center" spacing={2}>
                            <Tooltip placement="left" title="Nebula Fighter" arrow>
                                <ButtonWrapper
                                    className={theme === 'NebulaFighterTheme' ? 'active' : ''}
                                    onClick={() => {
                                        changeTheme('NebulaFighterTheme');
                                    }}
                                >
                                    {theme === 'NebulaFighterTheme' && (
                                        <CheckSelected>
                                            <CheckTwoToneIcon />
                                        </CheckSelected>
                                    )}
                                    <ColorSchemeWrapper className="colorSchemeWrapper nebulaFighter">
                                        <Box className="primary" />
                                        <Box className="secondary" />
                                    </ColorSchemeWrapper>
                                </ButtonWrapper>
                            </Tooltip>
                            <Tooltip placement="left" title="Green Fields" arrow>
                                <ButtonWrapper
                                    className={theme === 'GreenFieldsTheme' ? 'active' : ''}
                                    onClick={() => {
                                        changeTheme('GreenFieldsTheme');
                                    }}
                                >
                                    {theme === 'GreenFieldsTheme' && (
                                        <CheckSelected>
                                            <CheckTwoToneIcon />
                                        </CheckSelected>
                                    )}
                                    <ColorSchemeWrapper className="colorSchemeWrapper greenFields">
                                        <Box className="primary" />
                                        <Box className="secondary" />
                                    </ColorSchemeWrapper>
                                </ButtonWrapper>
                            </Tooltip>
                            <Tooltip placement="left" title="Dark Spaces" arrow>
                                <ButtonWrapper
                                    className={theme === 'DarkSpacesTheme' ? 'active' : ''}
                                    onClick={() => {
                                        changeTheme('DarkSpacesTheme');
                                    }}
                                >
                                    {theme === 'DarkSpacesTheme' && (
                                        <CheckSelected>
                                            <CheckTwoToneIcon />
                                        </CheckSelected>
                                    )}
                                    <ColorSchemeWrapper className="colorSchemeWrapper darkSpaces">
                                        <Box className="primary" />
                                        <Box className="secondary" />
                                    </ColorSchemeWrapper>
                                </ButtonWrapper>
                            </Tooltip>
                        </Stack>
                    </ThemeToggleWrapper>
                </Stack>
            </Popover>
        </>
    );
}

export default ThemeSwitcher;
