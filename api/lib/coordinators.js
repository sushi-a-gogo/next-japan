const coordinators = {
  coord1: {
    eventCoordinatorId: "coord1",
    firstName: "Mya",
    lastName: "Ashford",
    email: "mya@yy.zz",
    imageId: "coordinator-mya.png",
    cloudflareImageId: "cf68e1ff-447c-487f-60be-d0e3abfdc800",
    imageWidth: 255,
    imageHeight: 255,
  },
  coord2: {
    eventCoordinatorId: "coord2",
    firstName: "Minato",
    lastName: "Tanaka",
    email: "Minato@yy.zz",
    imageId: "coordinator-minato.png",
    cloudflareImageId: "8c6456b9-09d9-49ad-4f50-093088da5700",
    imageWidth: 255,
    imageHeight: 255,
  },
  coord3: {
    eventCoordinatorId: "coord3",
    firstName: "Sunny",
    lastName: "Banks",
    email: "sunnyb@yy.zz",
    imageId: "coordinator-sunny.png",
    cloudflareImageId: "7e9d73bd-e8d8-4ef9-c0f1-f446e80cb000",
    imageWidth: 255,
    imageHeight: 255,
  },
  coord4: {
    eventCoordinatorId: "coord4",
    firstName: "Luna",
    lastName: "Lively",
    email: "luna@yy.zz",
    imageId: "coordinator-luna.png",
    cloudflareImageId: "ffde2000-9897-45df-08f9-4f531ebe3900",
    imageWidth: 255,
    imageHeight: 255,
  },
};

const getCoordinatorDetails = (id) => {
  if (!coordinators[id]) {
    throw new Error(`Invalid coordinator ID: ${id}`);
  }
  return coordinators[id];
};

const coordinator = {
  list: [
    coordinators.coord1,
    coordinators.coord2,
    coordinators.coord3,
    coordinators.coord4,
  ],
  getCoordinatorDetails,
};

export default coordinator;
