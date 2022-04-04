/*
=========================================================
* Material Kit 2 React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";

import { Image } from "react-bootstrap";

import ieeta from "assets/images/footer_logos/ieeta.jpg";
import deti from "assets/images/footer_logos/deti-teste.jpg";
import ua from "assets/images/footer_logos/ua-logo.png";

function DefaultFooter({ content }) {
  const { copyright } = content;

  return (
    <MKBox component="footer">
      <Container>
        <Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginLeft: "-10%",
              }}
            >
              <Image src={ua} height={100} />
              <Image src={deti} height={100} />
              <Image src={ieeta} height={100} />
            </div>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center", my: 3 }}>
            {copyright}
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

// Typechecking props for the DefaultFooter
DefaultFooter.propTypes = {
  content: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])).isRequired,
};

export default DefaultFooter;
