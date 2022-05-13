// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Data
import data from "pages/LandingPages/Documentation/sections/data/imageBlockData";

function ImageBlock() {
  const renderData = data.map(({ title, image, image2 }) => (
    <Grid container spacing={3} sx={{ mb: 10 }} key={title}>
      <Grid item xs={12} lg={5}>
        <MKBox position="sticky" top="100px" pb={{ xs: 2, lg: 6 }}>
          <MKTypography variant="h3" fontWeight="bold" mb={1}>
            {title}
          </MKTypography>
        </MKBox>
      </Grid>
      <Grid item xs={12} lg={7}>
        <Grid container spacing={3}>
          {image2 !== "" ? (
            <>
              <img style={{ width: "800px" }} alt={title} src={image} />
              <img style={{ width: "800px", "margin-top": "50px" }} alt={title} src={image2} />
            </>
          ) : (
            <img alt={title} src={image} />
          )}
        </Grid>
      </Grid>
    </Grid>
  ));

  return (
    <MKBox component="section" my={6} py={4}>
      <Container>
        <Grid
          container
          item
          xs={12}
          lg={6}
          flexDirection="column"
          alignItems="center"
          sx={{ textAlign: "center", my: 6, mx: "auto", px: 0.75 }}
        />
      </Container>
      <Container sx={{ mt: 6 }}>{renderData}</Container>
    </MKBox>
  );
}

export default ImageBlock;
