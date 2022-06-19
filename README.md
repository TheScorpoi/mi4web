# mi4web

<p align="center">
  <img  src="/images/logo_branco.png" height=275 width=600>
</p>
<p align="center"> A full web based medical image viewer </p>
<p align="center"> The project website can be accessed by this <a href="https://thescorpoi.github.io">link</a> </p

<hr>

## About the project

Nowadays, the zero-footprint fully web-based visualization is making its way and gaining wider acceptance within the medical imaging community. Since the level of acceptance is growing up, the necessity of upgrading and building new functionalities and features is mandatory, so that it can continue to gain recognition and grow. One of these applications is OHIF, a zero-footprint, open source and web-based medical imaging viewer, that gives us the ability to add and configure extensions, which makes it very expandable. Therefore , this platform will be the starting point of our project.

## Demo
  Click on the image to see the demo.
  <a href="https://www.youtube.com/watch?v=avFWvRrvVhc"> <img  src="/images/ezgif.com-gif-maker.gif"></a>


## Main goals

Even though OHIF already has a lot of functionalities, it would be helpful for the healthcare professionals to have some additional features such as :

- Basic transactions for medical image storage and retrieval ;
- DICOM import and export;
- Multiplanar image display functionalities; 
- 3D Display tools as VTK plugins;
- Image Annotation Edition and Storage;
- Creation of Medical Reports;
- Admin Interface to manage the application equipment and the access.

## Expected Results

If all our goals are accomplished we will have a platform on the web that allows us to visualize image studies using a viewer client in conjunction with a server.
Also, the services will have to run on the web and in a client-server structure. 
Moreover, the visualization of the images will have to allow canonical views and three-dimensional object views and the implemented system will have to be distributed. 
Finally, we plan to have a platform capable of supporting different users and an admin to manage the users and the application. 



## Project Documentation

The project documentation can be found in the following [page](https://thescorpoi.github.io/documentation) in our project website, or in the [doc](/doc/) directory in this repository.

#### Arquitecture

<img src="/images/arquitecture.png">

>In a first view we can separate the architecture into four main modules: Frontend, Backend, Persistence and PACS Server. In the frontend module, since the OHIF viewer was the starting point of the project, the technology selected was React. In the backend module, we have to deal with many aspects, an API is necessary to communicate with the frontend and the server, to generate and process the 3D images it is important to have an image processing component. Also, It is extremely important to have a secure system, because of that an authentication protocol was implemented. In the Persistence Module, we look forward to a simple database, MySQL, to store user profiles mainly.


#### Information Model

<img src="/images/information_model.aa712f7c.png">

>Firstly, we created the table user, which has two descendents, the table not_accepted, which are the users that are yet to be accepted by the administrator, and the table staff, which are the users that were already verified and accepted by the administrator. There is also the table admin, which defines the administrator of our application, having the responsability of checking and accepting users, and manage everything. Lastly, we also have the table chart_info, which provides the information about the number of studies carried out per day.

#### Deployment Diagram 

<img src="/images/deployment.png">

>In a short version, the deployment architecture is basically a server with DICOM images, that store the images, and are able to make and receive queries with help of DICOMWeb API. A viewer, which permits the user to see the visualisation of the DICOM images, and make operations on it. In order to have this deployment, we have 2 virtual machines, on IEETA, the access is only possible in UA network, or using the UA VPN.

#### Use Case Diagram

<img src="/images/useCaseRest.c2df0660.png">
<img src="/images/useCaseSM.67844576.png">



## How to run the application

If you want to run run the application, you need to enter on [viewer](/viewer) directory and run the following command:

```bash
yarn install
yarn start
```

To to put database up, you will need to run the docker-compose file in the root of the repository: 
```bash
docker-compose up
```

Run the authentication protocol, and the nodeJS APIS:

Go to the [authentication](/authentication/) directory and run the following command:
```bash
docker-compose up
```

## How to deploy the application on the VMs:

The deploy proccess is fully documented in the [deploy](/deploy/) directory.
<>

## Group members

| NMec | Name | Github | Email |
|--:|---|---|---|
| 98498 | **Daniel Figueiredo** | [daniff15](https://github.com/daniff15) | dani.fig@ua.pt |
| 98495 | **André Freixo** | [andre180701](https://github.com/andre180701) | andrefreixo18@ua.pt |
| 98491 | **Pedro Sobral** | [TheScorpoi](https://github.com/TheScorpoi) | sobral@ua.pt |
| 98513 | **Eva Bartolomeu** | [eva-pomposo](https://github.com/eva-pomposo) | evabartolomeu@ua.pt |
| 98629 | **Marta Fradique** | [MartaFradique](https://github.com/MartaFradique) | martafradique@ua.pt |
