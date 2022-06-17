import architeture from "Documents/architeture.png";
import deploy from "Documents/deploy_diagram.png";
import infomoodel from "Documents/information_model.png";
import usecaseadmin from "Documents/useCaseSM.png";
import usecaserest from "Documents/useCaseRest.png";
import calendar1 from "Documents/calendar1.png";
import calendar2 from "Documents/calendar2.png";

export default [
  {
    title: "Architeture",
    image: architeture,
    image2: "",
    lildescription:
      "The architecture are separate into four main modules. Frontend, Backend, Persistence, PACS Server. In the frontend module, since the OHIF viewer was the starting point of the project, the technology selected was React.In the backend module, we have to deal with many aspects, an API is necessary to communicate with the frontend and the server, to generate and process images, and as security es very important an authentication protocol was implemented.In the Persistence Module, we look forward to a simple database, MySQL.In the PACS Server module, an Orthanc Server that allows us to handle DICOM images.",
  },
  {
    title: "Deployment Diagram",
    image: deploy,
    image2: "",
    lildescription:
      "In a short version, the deployment architecture is basically a server with DICOM images, that store the images, and are able to make and receive queries with help of DICOMWeb API. A viewer, which permits the user to see the visualisation of the DICOM images, and make operations on it. In order to have this deployment, we have 2 virtual machines, on IEETA, the access is only possible in UA network, or using the UA VPN.",
  },
  {
    title: "Use Case Diagram",
    image: usecaseadmin,
    image2: usecaserest,
    lildescription:
      "We have four main actors in the system. The system manager, which is an administrator of the system, and is able to manage the access to the application. The guest which is a non-logged user, has the same funcionalities has a Referring Imaging Staff, although he only has acess to a certain amount of fictitious studies. The Clinical Imaging Staff, have acess to the Referring Imaging Staff functionalities and can make reports and make annotations on the pacient's studies.",
  },
  {
    title: "Information Model",
    image: infomoodel,
    image2: "",
    lildescription:
      "Firstly, we created the table user, which has two descendents, the table not_accepted, which are the users that are yet to be accepted by the administrator, and the table staff, which are the users that were already verified and accepted by the administrator. There is also the table admin, which defines the administrator of our application, having the responsability of checking and accepting users, and manage everything. Lastly, we also have the table chart_info, which provides the information about the number of studies carried out per day.",
  },
  {
    title: "Calendar",
    image: calendar1,
    image2: calendar2,
    lildescription:
      "To manage tasks and maintain the group focused on essencial tasks we use the Roadmap from Jira.",
    note: "(Click on the image to get a better view)",
  },
];
