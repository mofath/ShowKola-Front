import AssignmentIndTwoToneIcon from '@mui/icons-material/AssignmentIndTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import SupportTwoToneIcon from '@mui/icons-material/SupportTwoTone';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import Projector  from 'mdi-material-ui/Projector';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

const menuItems = [
  {
    heading: 'Devices',
    items: [
      {
        name: 'List',
        icon: Projector,
        link: '/devices/list'
      },
      {
        name: 'New Device',
        icon: AddCircleTwoToneIcon,
        link: '/devices/create'
      },
      {
        name: 'Trash',
        icon: DeleteTwoToneIcon,
        link: '/devices/trash'
      },
    ]
  },
];

export default menuItems;
