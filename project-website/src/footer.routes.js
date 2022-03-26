// @mui icons
// Material Kit 2 React components
import MKTypography from "components/MKTypography";

// Images
const date = new Date().getFullYear();

export default {
  socials: [],
  menus: [],
  copyright: (
    <MKTypography variant="button" fontWeight="regular">
      All rights reserved. Copyright &copy; {date} MI4WEB{" "}
    </MKTypography>
  ),
};
