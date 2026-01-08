const coordinators = {
  coord1: {
    eventCoordinatorId: "coord1",
    firstName: "Mya",
    lastName: "Ashford",
    email: "mya@yy.zz",
    biography:
      "Mya Ashford has been the heartbeat of Next Japan for 6 vibrant years. With a knack for turning chaos into confetti, she’s the one who makes sure every attendee leaves with a smile and a story. When she’s not juggling schedules, you’ll find her scouting the best ramen spots in town—because great events start with great noodles!",
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
    biography:
      "Minato Tanaka, our resident logistics ninja, joined Next Japan 4 years ago and instantly became the calm eye in every event storm. Fluent in three languages and a master of on-the-fly problem solving, Minato ensures every detail—from stage lights to sake pairings—lands perfectly. Off-duty, he’s probably sketching the next big venue layout.",
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
    biography:
      "Sunny Banks brings 5 years of sunshine to Next Japan. Known for her infectious energy and a playlist that can turn any room into a dance floor, Sunny is the ultimate vibe curator. She believes every event should feel like a mini-festival, and her secret weapon? A never-ending supply of glow sticks and good vibes.",
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
    biography:
      "Luna Lively has been lighting up Next Japan for 3 years with her creative flair and boundless imagination. Whether it’s crafting immersive themes or hunting down the quirkiest photo-ops, Luna turns ordinary gatherings into unforgettable adventures. Fun fact: she once convinced an entire crowd to wear paper hats—pure magic!",
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

const pickTwoUnique = () => {
  const copy = [...coordinator.list];
  for (let i = copy.length - 1; --i >= 0; ) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return [copy[0], copy[1]];
};

const coordinator = {
  list: [
    coordinators.coord1,
    coordinators.coord2,
    coordinators.coord3,
    coordinators.coord4,
  ],
  getCoordinatorDetails,
  pickTwoUnique,
};

export default coordinator;
