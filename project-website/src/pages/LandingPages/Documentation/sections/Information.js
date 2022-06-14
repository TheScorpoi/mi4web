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

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Material Kit 2 React examples
import CenteredBlogCard from "examples/Cards/BlogCards/CenteredBlogCard";

import m1 from "Documents/MI4WEB-M1.pdf";
import m2 from "Documents/MI4WEB-M2.pdf";
import m3 from "Documents/MI4WEB-M3.pdf";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import ImageBlock from "./ImageBlock";

function Information() {
  return (
    <MKBox component="section" py={12}>
      <Container>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Grid container justifyContent="flex-start">
              <Grid item xs={12} md={6} mb={3}>
                <DefaultInfoCard
                  color="info"
                  icon="flag"
                  title="M1 Presentation"
                  description=""
                  action={{
                    type: "external",
                    route: m1,
                    label: "Click here",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  color="info"
                  icon="flag"
                  title="M2 Presentation"
                  description=""
                  action={{
                    type: "external",
                    route: m2,
                    label: "Click here",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  color="info"
                  icon="flag"
                  title="M3 Presentation"
                  description=""
                  action={{
                    type: "external",
                    route: m3,
                    label: "Click here",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  color="info"
                  icon="flag"
                  title="NOT YET..."
                  description=""
                  action={{
                    type: "external",
                    route: "",
                    label: "Click here",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
            <CenteredBlogCard
              image="https://www.gurobi.com/wp-content/plugins/hd_documentations/content/images/documentation-example-tour.jpg"
              title="Documentation"
              description="Fully docummentated website."
              action={{
                type: "internal",
                route: "pages/company/about-us",
                color: "info",
              }}
            />
          </Grid>
        </Grid>
      </Container>
      <ImageBlock />
    </MKBox>
  );
}

export default Information;
