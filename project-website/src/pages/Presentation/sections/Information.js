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
import RotatingCard from "examples/Cards/RotatingCard";
import RotatingCardFront from "examples/Cards/RotatingCard/RotatingCardFront";
import RotatingCardBack from "examples/Cards/RotatingCard/RotatingCardBack";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Images
import bgFront from "assets/images/rotating-card-bg-front.jpeg";
import bgBack from "assets/images/rotating-card-bg-back.jpeg";

import MKTypography from "components/MKTypography";

function Information() {
  return (
    <>
      <MKBox
        style={{ marginLeft: "20%" }}
        display="flex"
        alignItems="center"
        borderRadius="xl"
        my={2}
        py={6}
        sx={{
          backgroundColor: "#F6F6F6",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "60%",
        }}
      >
        <Container>
          <Grid container item xs={12} lg={11} sx={{ ml: { xs: 0, lg: 6 } }}>
            <MKTypography variant="h1" color="dark" mb={1}>
              MI4WEB
            </MKTypography>
            <MKTypography
              style={{ "text-align": "justify" }}
              variant="body1"
              color="text"
              opacity={0.8}
            >
              In this project we are going to create a platform in the Web that allows us to
              visualize medical image studies using a visualizer based on OHIF in conjunction with
              ORTHANC, which implements PACS system. The main objective of this project is to
              develop extensions capable of adding functionalities to treat and visualize medical
              images, both in 2D and 3D.
            </MKTypography>
            <MKTypography
              component="a"
              href="https://drive.google.com/drive/folders/1-hUIkkTqyByItie7QjvyHMO3qNoHl9sL?usp=sharing"
              target="_blank"
              rel="noreferrer"
              variant="body2"
              color="white"
              fontWeight="regular"
              sx={{
                display: "flex",
                alignItems: "center",

                "& .material-icons-round": {
                  fontSize: "1.125rem",
                  transform: `translateX(3px)`,
                  transition: "transform 0.2s cubic-bezier(0.34, 1.61, 0.7, 1.3)",
                },

                "&:hover .material-icons-round, &:focus .material-icons-round": {
                  transform: `translateX(6px)`,
                },
              }}
            />
          </Grid>
        </Container>
      </MKBox>
      <MKBox component="section" py={6} my={6}>
        <Container>
          <Grid container item xs={11} spacing={3} alignItems="center" sx={{ mx: "auto" }}>
            <Grid item xs={12} lg={4} sx={{ mx: "auto" }}>
              <RotatingCard>
                <RotatingCardFront
                  image={bgFront}
                  icon="touch_app"
                  title={
                    <>
                      OUR GOALS
                      <br />
                    </>
                  }
                  description=""
                />
                <RotatingCardBack
                  image={bgBack}
                  icon="touch_app"
                  title="OUR GOALS"
                  action={{
                    type: "internal",
                    route: "/sections/page-sections/page-headers",
                  }}
                />
              </RotatingCard>
            </Grid>
            <Grid item xs={12} lg={7} sx={{ ml: "auto" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DefaultInfoCard
                    icon="content_copy"
                    title="WEB PLATAFORM"
                    description="Having a web plataform in the Web that allows us to visualize image studies using a visualizer
                  in conjunction with a server."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DefaultInfoCard
                    icon="flip_to_front"
                    title="VIEWS"
                    description="The visualisation of the images will have to allow canonical views and three-dimensional
                  object views."
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ mt: { xs: 0, md: 6 } }}>
                <Grid item xs={12} md={6}>
                  <DefaultInfoCard
                    icon="settings_suggest"
                    title="DISTRIBUTED SYSTEM"
                    description="The implemented system will have to be distributed."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DefaultInfoCard
                    icon="devices"
                    title="CLIENT-SERVER"
                    description="The services will have to run in the web, in a client-server structure."
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ mt: { xs: 0, md: 6 } }}>
                <Grid item xs={12} md={6}>
                  <DefaultInfoCard
                    icon="move_up"
                    title="TRANSACTIONS"
                    description="Basic transactions for medical imaging storage and retrieval."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DefaultInfoCard
                    icon="image_search"
                    title="IMAGE MANIPULATION"
                    description="Core 2D image display functionalities."
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ mt: { xs: 0, md: 6 } }}>
                <Grid item xs={12} md={6}>
                  <DefaultInfoCard
                    icon="burst_mode"
                    title="IMAGE SEGMENTATION"
                    description="Interactive image segmentation tools."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DefaultInfoCard
                    icon="storage"
                    title="PACS SERVER"
                    description="Usage of PACS server to acess medical images."
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </MKBox>
    </>
  );
}

export default Information;
