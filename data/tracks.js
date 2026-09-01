/**
 * @typedef {Object} Track
 * @property {string} id
 * @property {string} title
 * @property {string} artist
 * @property {string} album
 * @property {string} cover
 * @property {string} src              – local / SoundHelix fallback for HTML5 player
 * @property {'hindi'|'marathi'} language
 * @property {string|null} spotifyId   – Spotify track ID (embed + open link)
 * @property {string|null} youtubeId   – YouTube video ID (embed + open link)
 */

/** @type {Track[]} */
export const allTracks = [
  {
    file: "01  Ajab Si - www.downloadming.com.mp3",
    query: "01  Ajab Si - www.downloadming.com",
    youtubeId: "RD7KKVb0_IdD4",
    youtubeUrl: "https://www.youtube.com/watch?v=RD7KKVb0_IdD4",
    title:
      "Aankhon Mein Teri Ajab Si | Om Shanti Om | Shahrukh Khan | Deepika Padukone",
  },
  {
    id: "1",
    title: "Ghan Aaj Barse",
    artist: "Swapnil Bandodkar",
    album: "Marathi Song",
    cover: "https://i.ytimg.com/vi/SMyds5pcrOk/hqdefault.jpg",
    src: "",
    language: "marathi",
    spotifyId: "26Nu5GRBUdEA0ms3CDWWzN",
    youtubeId: "SMyds5pcrOk",
  },

  {
    id: "2",
    title: "Baarish",
    artist: "Ash King & Shashaa Tirupati",
    album: "Half Girlfriend",
    cover: "https://i.ytimg.com/vi/BNfAf4To73c/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "4FeiicaPWhZZusS1rddYdc",
    youtubeId: "BNfAf4To73c",
  },

  {
    id: "3",
    title: "Kabhi Jo Baadal Barse",
    artist: "Arijit Singh",
    album: "Jackpot",
    cover: "https://i.ytimg.com/vi/qH1eRWlJpsY/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "5T1yqdTEpwwo8UsjriiAQK",
    youtubeId: "qH1eRWlJpsY",
  },

  {
    id: "4",
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    album: "Aashiqui 2",
    cover: "https://i.ytimg.com/vi/NUo8CKI34o4/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "56zZ48jdyY2oDXHVnwg5Di",
    youtubeId: "NUo8CKI34o4",
  },

  {
    id: "5",
    title: "Woh Baarishein",
    artist: "Arjun Kanungo",
    album: "Woh Baarishein",
    cover: "https://i.ytimg.com/vi/qxvL7fi75ks/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "3RFNUexrtXExkzTEiJ0eBh",
    youtubeId: "qxvL7fi75ks",
  },

  {
    id: "6",
    title: "Dekho Na",
    artist: "Sonu Nigam & Sunidhi Chauhan",
    album: "Fanaa",
    cover: "https://i.ytimg.com/vi/v4h5iPlxj0c/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "5q0pLxhyHvZXnYxaygt2Az",
    youtubeId: "v4h5iPlxj0c",
  },

  {
    id: "7",
    title: "Saanson Ko Saanson Mein",
    artist: "Babul Supriyo & Alka Yagnik",
    album: "Hum Tum",
    cover: "https://i.ytimg.com/vi/joqFbZy96Xk/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "6YRbDkyTzsizAWFz8kwiI7",
    youtubeId: "joqFbZy96Xk",
  },

  {
    id: "8",
    title: "Ishq Bulaava",
    artist: "Sanam Puri & Shipra Goyal",
    album: "Hasee Toh Phasee",
    cover: "https://i.ytimg.com/vi/c2gSzYLJ8sY/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "1fkjRQA8wXPPyxqYLbxuqy",
    youtubeId: "c2gSzYLJ8sY",
  },

  {
    id: "9",
    title: "Qaafirana",
    artist: "Arijit Singh & Nikhita Gandhi",
    album: "Kedarnath",
    cover: "https://i.ytimg.com/vi/ZmcBC9-wAXM/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "7BCp5hEiiDSmXsxsXkvYff",
    youtubeId: "ZmcBC9-wAXM",
  },

  {
    id: "10",
    title: "Apna Bana Le",
    artist: "Arijit Singh",
    album: "Bhediya",
    cover: "https://i.ytimg.com/vi/ElZfdU54Cp8/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "5bQ6oDLqvw8tywmnSmwEyL",
    youtubeId: "ElZfdU54Cp8",
  },
  {
    file: "01  Ajab Si - www.downloadming.com.mp3",
    query: "01  Ajab Si - www.downloadming.com",
    youtubeId: "RD7KKVb0_IdD4",
    youtubeUrl: "https://www.youtube.com/watch?v=RD7KKVb0_IdD4",
    title:
      "Aankhon Mein Teri Ajab Si | Om Shanti Om | Shahrukh Khan | Deepika Padukone",
  },
  {
    file: "08 - Vijayi Bhava - PagalSongs.com.mp3",
    query: "Shankar Mahadevan - Vijayi Bhava - PagalSongs.com",
    youtubeId: "YBp2OcI-nGs",
    youtubeUrl: "https://www.youtube.com/watch?v=YBp2OcI-nGs",
    title:
      "Vijayi Bhava - Full Video | Manikarnika | Kangana Ranaut | Shankar Ehsaan Loy | Prasoon Joshi",
    language: "hindi",
  },
  {
    file: "08--Hello-Kashi-Ahes-Tu---Kolhapuridjs- djsstation.com.mp3",
    query: "www.djsstation.com - Hello Kashi Ahes Tu www.djsstation.com",
    youtubeId: "RDpxl9vPRfJBo",
    youtubeUrl: "https://www.youtube.com/watch?v=RDpxl9vPRfJB",
    title: "Hello Kashi Ahes Tu",
    language: "marathi",
  },
  {
    file: "11 - Tere Naam (Sad) - PagalSongs.com.mp3",
    query: "Udit Narayan - Tere Naam (Sad) - PagalSongs.com",
    youtubeId: "bH3bLzYK8Dc",
    youtubeUrl: "https://www.youtube.com/watch?v=bH3bLzYK8Dc",
    title: "TERE NAAM (SAD)",
    language: "hindi",
  },
  {
    file: "11. Khudaya Khair - Reprise.mp3",
    query: "pagalworld.com - Khudaya Khair - Reprise",
    youtubeId: "2Z3OjNCtF8g",
    youtubeUrl: "https://www.youtube.com/watch?v=2Z3OjNCtF8g",
    title: "Khudaya Khair (Reprise)",
    language: "hindi",
  },
  {
    file: "12 - Tere Naam (Female) - PagalSongs.com.mp3",
    query: "Alka Yagnik - Tere Naam (Female) - PagalSongs.com",
    youtubeId: "4VtPirIHyQ0",
    youtubeUrl: "https://www.youtube.com/watch?v=4VtPirIHyQ0",
    title:
      "Tumse Milna - Video Song | Tere Naam | Himesh Reshammiya | Udit N, Alka Yagnik | Salman Khan,Bhoomika",
    language: "hindi",
  },
  {
    file: "12. Tum Ho.mp3",
    query: "Mohit Chauhan, Suzanne D'Mello - Tum Ho",
    youtubeId: "KgvWAHYhJF0",
    youtubeUrl: "https://www.youtube.com/watch?v=KgvWAHYhJF0",
    title: "Tum ho - Song by Mohit Chauhan and Suzanne D'Mello ❣️👀",
    language: "hindi",
  },
  {
    file: "128-Nadaan Parindey - Rockstar 128 Kbps.mp3",
    query: "A.R. Rahman, Mohit Chauhan - Nadaan Parindey",
    youtubeId: "HVyqSG-0kl8",
    youtubeUrl: "https://www.youtube.com/watch?v=HVyqSG-0kl8",
    title: "Rockstar | Naadaan Parindey | Official A.R.Rahman HD",
    language: "hindi",
  },
  {
    file: "128-Tum Tak - Raanjhanaa 128 Kbps.mp3",
    query: "A.R. Rahman, Javed Ali, Kirti Sagathia, A.V. Pooja - Tum Tak",
    youtubeId: "AGsn2ycFRqI",
    youtubeUrl: "https://www.youtube.com/watch?v=AGsn2ycFRqI",
    title:
      "A.R. Rahman - Tum Tak (Lyric Video) | Raanjhanaa | A. R. Rahman | Dhanush | Sonam Kapoor | Javed Ali",
    language: "hindi",
  },
  {
    file: "128-Tune Mere Jana 128 Kbps - 2024-07-17T204150.114.mp3",
    query: "Gajendra Verma - Tune Mere Jana",
    youtubeId: "yUu26tcUri0",
    youtubeUrl: "https://www.youtube.com/watch?v=yUu26tcUri0",
    title:
      "Gajendra Verma - Tune Mere Jaana Kabhi Nahi Jaana I Emptiness | Gajendra Verma Songs | Sonotek Music",
  },
  {
    file: "320kbps_Manmarziyaan 2018 - Daryaa.mp3",
    query: "Amit Trivedi, Shahid Mallya, Ammy Virk - Daryaa - JioSongs.com",
    youtubeId: "1Z_cClBsABE",
    youtubeUrl: "https://www.youtube.com/watch?v=1Z_cClBsABE",
    title:
      "Daryaa | Full Video Song | Manmarziyaan | Vicky, Taapsee | Ammy Virk, Shahid Mallya | Amit Trivedi",
  },
  {
    file: "A.R. Rahman - Roobaroo Best Audio SongRang De BasantiAamir KhanNaresh Iyer.mp3",
    query:
      "A.R. Rahman - Roobaroo Best Audio SongRang De BasantiAamir KhanNaresh Iyer",
    youtubeId: "OF688uk3Il0",
    youtubeUrl: "https://www.youtube.com/watch?v=OF688uk3Il0",
    title:
      "Roobaroo - Lyrical Video | Rang De Basanti | Aamir Khan | A.R. Rahman | Naresh Iyer",
  },
  {
    file: "Aabhalmaya_Marathi_Serial_Title_Song_आभाळमाया_देवकी_पंड_5bBNF2iblTo_140.mp3",
    query:
      "Aabhalmaya Marathi Serial Title Song |  आभाळमाया  |  देवकी पंडित | अशोक पत्की",
    youtubeId: "RjVGPy7Z1b4",
    youtubeUrl: "https://www.youtube.com/watch?v=RjVGPy7Z1b4",
    title:
      "Aabhalmaya - Title Track | Zee Marathi Show | Devki Pandit | Ashok Patki | Mangesh Kulkarni",
  },
  {
    file: "Aafreen 1920 London 320 Kbps.mp3",
    query: "KK, Antara Mitra, JAM8 - Aafreen - PagalNew",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Aakrosh - Saude Bazi (Encore).mp3",
    query: "Javed Ali - Saude Bazi (Encore) - www.hotmentos.com",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Aala-Re-Raja-Adarsh-Shinde.mp3",
    query: "Adarsh Shinde - Aala Re Raja",
    youtubeId: "ea5af6K_cCI",
    youtubeUrl: "https://www.youtube.com/watch?v=ea5af6K_cCI",
    title:
      "आला रे राजा - पूरा गीत- क्‍लासमेट्स मराठी फिल्‍म - अंकुश, सचित, साई, सोनाली",
  },
  {
    file: "Aale_Marathe_आले_मराठे_Video_Song_Digpal_Lanjekar_Devdu_VQM-jApoIEM_140.mp3",
    query:
      "Aale Marathe आले मराठे | Video Song | Digpal Lanjekar | Devdutta Baji | Subhedar सुभेदार",
    youtubeId: "fPYy20TkvYI",
    youtubeUrl: "https://www.youtube.com/watch?v=fPYy20TkvYI",
    title:
      "Aale Marathe आले मराठे  | Lyrical Song | Digpal Lanjekar | Devdutta Baji | Subhedar सुभेदार २५ ऑगस्ट",
  },
  {
    file: "Aao Milo Chalo Jab We Met 320 Kbps.mp3",
    query: "Pritam, Shaan, Ustad Sultan Khan - Aao Milo Chalo - PagalNew ",
    youtubeId: "NOg3rtJFphM",
    youtubeUrl: "https://www.youtube.com/watch?v=NOg3rtJFphM",
    title:
      "Aao Milo/Kya Mujhe Pyar Hai★Ep 10 | Sukriti Kakar,Ash King, Abhijit V |T-Series MixtapeS3| Bhushan K",
  },
  {
    file: "Aao Naa - Vishal Mishra.mp3",
    query: "Vishal Mishra (Pagalworld.TV) - Aao Naa (Pagalworld.TV)",
    youtubeId: "yFqRHN0FHcg",
    youtubeUrl: "https://www.youtube.com/watch?v=yFqRHN0FHcg",
    title:
      "Aao Naa (Official Video) Vishal Mishra | Terence Lewis & Larissa Bonesi | Kaushal Kishore |Saurabh P",
  },
  {
    file: "Aaoge Tum Kabhi - Aalas Ka Pedh 320 Kbps.mp3",
    query: "The Local Train - Aaoge Tum Kabhi",
    youtubeId: "i96UO8-GFvw",
    youtubeUrl: "https://www.youtube.com/watch?v=i96UO8-GFvw",
    title: "The Local Train - Aaoge Tum Kabhi (Official)",
  },
  {
    file: "Aas Pass Hai Khuda Anjaana Anjaani 320 Kbps.mp3",
    query:
      "Vishal-Shekhar, Rahat Fateh Ali Khan - Aas Pass Hai Khuda - PagalNew ",
    youtubeId: "PSc0-z8StoU",
    youtubeUrl: "https://www.youtube.com/watch?v=PSc0-z8StoU",
    title:
      "Aas Paas Hai Khuda Lyrical | Anjaana Anjaani | Priyanka Chopra, Ranbir Kapoor | Rahat Fateh Ali Khan",
  },
  {
    file: "Aata-Visavyache-Kshana-Lata-Mangeshkar.mp3",
    query: "Saleel Kulkarni - Aata Visavyache Kshana",
    youtubeId: "H4-TtMhOJyg",
    youtubeUrl: "https://www.youtube.com/watch?v=H4-TtMhOJyg",
    title:
      "Aata Visavyache kshana | Lata Mangeshkar | Kshana Amrutache | Times Music Spiritual",
  },
  {
    file: "Ab Kis Disha Jau_320(PagalWorld).mp3",
    query:
      "Rahat Fateh Ali Khan(PagaliWorld.Com) - Ab Kis Disha Jau(PagalWorld)",
    youtubeId: "NXp2VYsTcNM",
    youtubeUrl: "https://www.youtube.com/watch?v=NXp2VYsTcNM",
    title: "Kabhi Jo Yaad Meri Aayi Palko Se Julfe Hata Lena—#Lofi—You-Tube-",
  },
  {
    file: "Abhi Abhi (Jism ) - K.K - 320Kbps.mp3",
    query: "KK (PagalWorld.cool) - Abhi Abhi - PagalWorld.cool",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Abhi Kuch Dino Se - Dil To Bacha Hai Ji 320Kbps.mp3",
    query:
      "Mohit Chauhan - PagalWorld.info - Abhi Kuch Dino Se - PagalWorld.info",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Abhi Mujh Mein Kahin - Agneepath 320 Kbps.mp3",
    query: "Sonu Nigam, Ajay-Atul - Abhi Mujh Mein Kahin",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Abhi Na Jao Chhod Kar Hum Dono 128 Kbps.mp3",
    query: "Asha Bhosle, Mohammed Rafi - Abhi Na Jao Chhod Kar - PagalNew",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Adele_Adele_-_Skyfall.mp3",
    query: "Adele Adele - Skyfall | Swahilisongs.com",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Afreen Afreen _ Aankhe Dekhi _ Nauman Shafi.mp3",
    query: "Afreen Afreen _ Aankhe Dekhi _ Nauman Shafi",
    youtubeId: "bRvYWMiisMY",
    youtubeUrl: "https://www.youtube.com/watch?v=bRvYWMiisMY",
    title: "Afreen Afreen | Aankhe Dekhi | Nauman Shafi",
  },
  {
    file: "Afreen Afreen_320(PaglaSongs).mp3",
    query: "PaglaSongs.Com - Afreen Afreen(PaglaSongs)",
    youtubeId: "QFjX3ZdPFhA",
    youtubeUrl: "https://www.youtube.com/watch?v=QFjX3ZdPFhA",
    title:
      'Lyrical: "Charha De Rang" Song | Yamla Pagla Deewana | Dharmender, Sunny, Bobby',
  },
  {
    file: "Agar Tu Hota - Baaghi 320 Kbps.mp3",
    query: "Ankit Tiwari - Agar Tu Hota",
    youtubeId: "y1AhnOVOKSU",
    youtubeUrl: "https://www.youtube.com/watch?v=y1AhnOVOKSU",
    title:
      "अगर तू होता पूरा वीडियो गाना |  बागी | टाइगर श्रॉफ, श्रद्धा कपूर | अंकित तिवारी |टी-सीरिज",
  },
  {
    file: "Aila Re Aila.mp3",
    query: "pagalworld.com - Aila Re Aila pagalworld.com",
    youtubeId: "tlkWnGOm34k",
    youtubeUrl: "https://www.youtube.com/watch?v=tlkWnGOm34k",
    title: "अइला रे अइला पूरा गाना खट्टा मीठा | अक्षय कुमार, त्रिशा कृष्णन",
  },
  {
    file: "Aisha-sham.mp3",
    query: "amit trivedi , neuman pinto - sham - www.hotmentos.com",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Aisi Waisi Dosti Nahi Ye Number One Yaari Hai Whatsapp Status Ringtone [TubeRipper.com].mp3",
    query:
      "Aisi Waisi Dosti Nahi Ye Number One Yaari Hai Whatsapp Status Ringtone [TubeRipper.com]",
    youtubeId: "ZtdwJRT2ZsQ",
    youtubeUrl: "https://www.youtube.com/watch?v=ZtdwJRT2ZsQ",
    title:
      "Aesi Waise Dosti Nahi Ye number One Yaari new WhatsApp Status Video tag your friend#status_star07",
  },
  {
    file: "Ajab Si Om Shanti Om 320 Kbps.mp3",
    query: "KK - Ajab Si - PagalNew ",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Alvida Jhhima.mp3",
    query: "Alvida",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Alvida Life In A Metro 320 Kbps.mp3",
    query: "Pritam, KK - Alvida - PagalNew ",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Amplifier (Imran Khan).mp3",
    query: "pagalworld.com - Amplifier (Imran Khan) pagalworld.com",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Anand Harpla - Dharmaveer- [PagalWorld.NL].mp3",
    query: "Saurabh Salunke - Anand Harpla - Dharmaveer - PagalWorld.NL",
    youtubeId: "xsZsqW36sHU",
    youtubeUrl: "https://www.youtube.com/watch?v=xsZsqW36sHU",
    title:
      "Anand Harpla - Lyrical | Dharmaveer | Prasad Oak | Saurabh Salunke |Chinar - Mahesh |Mangesh Kangane",
  },
  {
    file: "Arjan Vailly Animal 320 Kbps.mp3",
    query: "Bhupinder Babbal - Arjan Vailly - PagalNew",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Arziyaan - Jigariyaa 320 Kbps.mp3",
    query: "Raj-Prakash, Vikrant Bhartiya, Aishwarya Majmudar - Arziyaan",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Awari - Ek Villain 128 Kbps.mp3",
    query: "Rabbi Ahmed, Adnan Dhool, Momina Mustehsan - Awari",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Baarish Lete Aana - Darshan Raval.mp3",
    query: "Darshan Raval - Pagalorld.co - Baarish Lete Aana - Pagalorld.co",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Baarishein - Anuv Jain.mp3",
    query: "Anuv Jain (Pagalworld.one) - Baarishein (Pagalworld.one)",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Badal Pe Paon Hain Song _ Chak De India _ Shah Rukh Khan _ Hema Sardesai _ Salim-Sulaiman, Jaideep S ( 128kbps ).mp3",
    query:
      "YRF - Badal Pe Paon Hain Song | Chak De India | Shah Rukh Khan | Hema Sardesai | Salim-Sulaiman, Jaideep S",
    youtubeId: "DmsOinqrPvQ",
    youtubeUrl: "https://www.youtube.com/watch?v=DmsOinqrPvQ",
    title: "Badal Pe Paon Hain Song | Chak De India | Shah Rukh Khan",
  },
  {
    file: "Bahara Chill Version I Hate Luv Storys 320 Kbps.mp3",
    query:
      "Vishal-Shekhar, Rahat Fateh Ali Khan - Bahara (Chill Version) - PagalNew ",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Bahara I Hate Luv Storys 320 Kbps.mp3",
    query:
      "Vishal-Shekhar, Shreya Ghoshal, Sona Mohapatra - Bahara - PagalNew ",
    youtubeId: "jlDS5uFhX48",
    youtubeUrl: "https://www.youtube.com/watch?v=jlDS5uFhX48",
    title:
      "Bahara - Vishal–Shekhar, Shreya Ghoshal, Sona Mohapatra (Lyrics) | 7clouds Hindi",
  },
  {
    file: "Baith Jata Hoon Mitti Pe Aksar_ Written_ Harivansh Rai Bachhan, Voice_ Simerjeet Singh _ Poem ( 128kbps ).mp3",
    query:
      'WHATS THE STORY? - Baith Jata Hoon Mitti Pe Aksar" Written: Harivansh Rai Bachhan, Voice: Simerjeet Singh | Poem',
    youtubeId: "iHNc-W5tin4",
    youtubeUrl: "https://www.youtube.com/watch?v=iHNc-W5tin4",
    title:
      "Baith Jata Hoon Aksar - Harivansh Rai Bachchan (Recited by Simerjeet Singh)",
  },
  {
    file: "Bakhuda Tumhi Ho Kismat Konnection 320 Kbps.mp3",
    query: "Pritam, Atif Aslam, Alka Yagnik - Bakhuda Tumhi Ho - PagalNew ",
    youtubeId: "-kI769Xigik",
    youtubeUrl: "https://www.youtube.com/watch?v=-kI769Xigik",
    title:
      "Bakhuda Tumhi Ho | Atif Aslam | Alka Yagnik | Kismat Konnection | 2009",
  },
  {
    file: "Bandeya Rey Bandeya Simmba 320 Kbps.mp3",
    query: "Arijit Singh, Asees Kaur - Bandeya Rey Bandeya - PagalNew ",
    youtubeId: "Wj8C_bpnkTY",
    youtubeUrl: "https://www.youtube.com/watch?v=Wj8C_bpnkTY",
    title:
      "Bandeya Rey Bandeya Lyrical | SIMMBA | Ranveer Singh, Sara Ali Khan | Arijit Singh | Asees Kaur",
  },
  {
    file: "Barbaadiyan - Shiddat.mp3",
    query: "Sachet Tandon, Nikhita Gandhi - Barbaadiyan",
    youtubeId: "vJQMhj6WYZA",
    youtubeUrl: "https://www.youtube.com/watch?v=vJQMhj6WYZA",
    title:
      "Barbaadiyan (Full Video)| Shiddat |Sunny K,Radhika M |Sachet T,Nikhita G, Madhubanti B|Sachin -Jigar",
  },
  {
    file: "Bavari Saad Full Lyrical Video Song _ Yuvati Music ( 128kbps ).mp3",
    query: "Yuvati Music - Bavari Saad Full Lyrical Video Song | Yuvati Music",
    youtubeId: "gL_GK5YuEbE",
    youtubeUrl: "https://www.youtube.com/watch?v=gL_GK5YuEbE",
    title: "Bavari Saad Full Lyrical Video Song | Yuvati Music",
  },
  {
    file: "Beh Chala Uri - Yasser Desai(DJTuborg).mp3",
    query: "DJTuborg.Com - Beh Chala Uri - Yasser Desai(DJTuborg)",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Bhaag Milkha Bhaag Rock Version Shankar Ehsaan Loy 320 Kbps.mp3",
    query:
      "Shankar-Ehsaan-Loy, Siddharth Mahadevan - Bhaag Milkha Bhaag (Rock Version) - PagalNew ",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Bharat - PagalSongs.com.mp3",
    query: "Shankar Mahadevan - Bharat - PagalSongs.com",
    youtubeId: "YJndhJ-KDjM",
    youtubeUrl: "https://www.youtube.com/watch?v=YJndhJ-KDjM",
    title:
      "Shankar Mahadevan जी का 'Breathless' Performance | Indian Idol Season 5",
  },
  {
    file: "Bin Tere I Hate Luv Storys 320 Kbps.mp3",
    query:
      "Vishal-Shekhar, Shafqat Amanat Ali, Sunidhi Chauhan - Bin Tere - PagalNew ",
    youtubeId: "pGuc4hPhiKw",
    youtubeUrl: "https://www.youtube.com/watch?v=pGuc4hPhiKw",
    title:
      "Bin Tere - Lyrical Song | I Hate Luv Storys | Sonam Kapoor, Imran Khan | Vishal & Shekhar",
  },
  {
    file: "Bin Tere Reprise I Hate Luv Storys 320 Kbps.mp3",
    query: "Vishal-Shekhar, Shekhar Ravjiani - Bin Tere (Reprise) - PagalNew ",
    youtubeId: "nDv9h6CDwUk",
    youtubeUrl: "https://www.youtube.com/watch?v=nDv9h6CDwUk",
    title:
      "Bin Tere (Reprise) Song - I Hate Luv Storys|Sonam Kapoor,Imran Khan|Shekhar Ravjiani",
  },
  {
    file: "bollywood_MD 2016 - Tu Hai.mp3",
    query: "A R Rahman, Sanah Moidutty - Tu Hai - JioSongs.com",
    youtubeId: "gWFKZlvNFrU",
    youtubeUrl: "https://www.youtube.com/watch?v=gWFKZlvNFrU",
    title:
      "MTV Unplugged Season 6 : Tu Hai | A.R. Rahman, Sanah Moidutty  | T-Series",
  },
  {
    file: "bollywood_NS - Rozana.mp3",
    query: "Shreya Ghoshal - Rozana -  SabTunes.com",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "bollywood_STK - Sanam Teri Kasam.mp3",
    query: "Ankit Tiwari , Palak Muchhal - Sanam Teri Kasam - SabTunes.com",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "bollywood_Sultan - Bulleya.mp3",
    query: "Papon - Bulleya - SabTunes.com",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Bolo Kab Pratikar Karoge - PagalSongs.com.mp3",
    query: "Sukhwinder Singh - Bolo Kab Pratikar Karoge - PagalSongs.com",
    youtubeId: "aJTGNZ6LP9w",
    youtubeUrl: "https://www.youtube.com/watch?v=aJTGNZ6LP9w",
    title:
      "Bolo Kab Pratikar Karoge - Full Video | Manikarnika | Sukhwinder Singh | Shankar Ehsaan Loy",
  },
  {
    file: "Brothers Anthem Full Video - Akshay Kumar,Sidharth Malhotra_Vishal Dadlani_Ajay-Atul ( 128kbps ).mp3",
    query:
      "SonyMusicIndiaVEVO - Brothers Anthem Full Video - Akshay Kumar,Sidharth Malhotra|Vishal Dadlani|Ajay-Atul",
    youtubeId: "IjBAgWKW12Y",
    youtubeUrl: "https://www.youtube.com/watch?v=IjBAgWKW12Y",
    title:
      "Vishal Dadlani - Brothers Anthem | Akshay Kumar, Sidharth Malhotra | Ajay-Atul",
  },
  {
    file: "Carol of the Bells _ Whatsapp status full screen _ Ringtone - carolofthebells- lindsey ( 128kbps ).mp3",
    query:
      "Jayasurya D - Carol of the Bells | Whatsapp status full screen | Ringtone #carolofthebells#lindsey",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Chahun Main Ya Naa Aashiqui 2 128 Kbps.mp3",
    query: "Palak Muchhal, Arijit Singh - Chahun Main Ya Naa - PagalNew ",
    youtubeId: "VdyBtGaspss",
    youtubeUrl: "https://www.youtube.com/watch?v=VdyBtGaspss",
    title:
      "चाहूँ मैं या ना पूरा वीडियो गाना आशिकी 2 | आदित्य रॉय कपूर, श्रद्धा कपूर",
  },
  {
    file: "Chahun Main Ya Naa Aashiqui 2 320 Kbps.mp3",
    query: "Palak Muchhal, Arijit Singh - Chahun Main Ya Naa - PagalNew ",
    youtubeId: "VdyBtGaspss",
    youtubeUrl: "https://www.youtube.com/watch?v=VdyBtGaspss",
    title:
      "चाहूँ मैं या ना पूरा वीडियो गाना आशिकी 2 | आदित्य रॉय कपूर, श्रद्धा कपूर",
  },
  {
    file: "Chak Lein De.mp3",
    query: "Kailash-Paresh-Naresh, Kailash Kher - Chak Lein De",
    youtubeId: "kd-6aw99DpA",
    youtubeUrl: "https://www.youtube.com/watch?v=kd-6aw99DpA",
    title: "चक लेने दे  चांदनी चौक टू चाइना, अक्षय कुमार",
  },
  {
    file: "Chand Tu Nabhatla - Sandook _ Sumeet Raghvan, Bhargavi Chirmuley & Sharad Ponkshe ( 128kbps ).mp3",
    query:
      "Zee Music Marathi - Chand Tu Nabhatla - Sandook | Sumeet Raghvan, Bhargavi Chirmuley & Sharad Ponkshe",
    youtubeId: "C6vn9jefNj8",
    youtubeUrl: "https://www.youtube.com/watch?v=C6vn9jefNj8",
    title:
      "Chand Tu Nabhatla - Sandook | Sumeet Raghvan, Bhargavi Chirmuley & Sharad Ponkshe",
  },
  {
    file: "Chatrapati shivaji maharaj new song bgm Ringtone 2021 __ Shivaji maharaj ringtone __ शिवाजी महाराज _fire_ ( 128kbps ).mp3",
    query:
      "PANDURANG SURVASE - Chatrapati shivaji maharaj new song bgm Ringtone 2021 || Shivaji maharaj ringtone || शिवाजी महाराज 🔥",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Chhota Don_192(PagalWorldl).mp3",
    query: "PagalWorldl.Com - Chhota Don(PagalWorldl)",
    youtubeId: "AfyrolOl5Nc",
    youtubeUrl: "https://www.youtube.com/watch?v=AfyrolOl5Nc",
    title:
      "Chota Chattri Comedy Scene | Paresh Rawal VS Johnny Lever | Awara Paagal Deewana | Netflix India",
  },
  {
    file: "Chintoo 2 song - Ya Vishwachi.mp3",
    query: "Chintoo 2 song - Ya Vishwachi",
    youtubeId: "9tjYA5Cn-Q8",
    youtubeUrl: "https://www.youtube.com/watch?v=9tjYA5Cn-Q8",
    title: "Chintoo 2 song   Ya Vishwachi",
  },
  {
    file: "Chitta - Shiddat.mp3",
    query: "Manan Bhardwaj - Chitta",
    youtubeId: "CJq1hGSO89A",
    youtubeUrl: "https://www.youtube.com/watch?v=CJq1hGSO89A",
    title:
      "Chitta (Full Video) | Shiddat | Sunny Kaushal, Radhika Madan, Mohit R ,Diana P | Manan Bhardwaj",
  },
  {
    file: "Choo Lo.mp3",
    query: "The Local Train - Choo Lo",
    youtubeId: "sFMRqxCexDk",
    youtubeUrl: "https://www.youtube.com/watch?v=sFMRqxCexDk",
    title: "The Local Train - Aalas Ka Pedh - Choo Lo (Official Audio)",
  },
  {
    file: "Chori Chori Hunterrr 320 Kbps.mp3",
    query: "Arijit Singh, Sona Mohapatra - Chori Chori - PagalNew",
    youtubeId: "FDh1TYJPpbo",
    youtubeUrl: "https://www.youtube.com/watch?v=FDh1TYJPpbo",
    title:
      "Chori Chori - Lyrical | Hunterrr | Arijit Singh & Sona Mohapatra | Gulshan D, Radhika Apte, Sai T",
  },
  {
    file: "Coke Studio Season 10_ Latthay Di Chaadar_ Quratulain Balouch & Farhan Saeed.mp3",
    query:
      "Coke Studio Season 10_ Latthay Di Chaadar_ Quratulain Balouch & Farhan Saeed",
    youtubeId: "SCOKysMnH50",
    youtubeUrl: "https://www.youtube.com/watch?v=SCOKysMnH50",
    title:
      "Coke Studio Season 10| Latthay Di Chaadar| Quratulain Balouch & Farhan Saeed",
  },
  {
    file: "Cute little Sweet baby girl status song_vege vege dhau marathi birthday song whatsapp status song___ ( 128kbps ).mp3",
    query:
      "sunil shinde 4147 - Cute little Sweet baby girl status song_vege vege dhau marathi birthday song whatsapp status song_||",
    youtubeId: "6CzosFHcgxQ",
    youtubeUrl: "https://www.youtube.com/watch?v=6CzosFHcgxQ",
    title:
      "Cute little Sweet baby girl status song_vege vege dhau marathi birthday song whatsapp status song_||",
  },
  {
    file: "Dangal - Title Track _ Lyrical Video _ Dangal _ Aamir Khan _ Pritam _ Amitabh B _ Daler Mehndi ( 128kbps ).mp3",
    query:
      "Zee Music Company - Dangal - Title Track | Lyrical Video | Dangal | Aamir Khan | Pritam | Amitabh B | Daler Mehndi",
    youtubeId: "jMfvlh0tjyo",
    youtubeUrl: "https://www.youtube.com/watch?v=jMfvlh0tjyo",
    title:
      "Dangal - Title Track | Lyrical Video | Dangal | Aamir Khan | Pritam | Amitabh B | Daler Mehndi",
  },
  {
    file: "Desh Mere Bhuj - Arijit Singh.mp3",
    query: "Arijit Singh (Pagalworld.pw) - Desh Mere (Pagalworld.pw)",
    youtubeId: "_vuqYtz3TfQ",
    youtubeUrl: "https://www.youtube.com/watch?v=_vuqYtz3TfQ",
    title:
      "Oh Desh Mere Teri Shan Pe Sadke (Lyrics) - Arijit Singh | 15 August 2022 Song |",
  },
  {
    file: "Desi Girl Dostana Original Motion Picturetrack 320 Kbps.mp3",
    query:
      "Vishal-Shekhar, Shankar Mahadevan, Sunidhi Chauhan, Vishal Dadlani - Desi Girl - PagalNew ",
    youtubeId: "Gi2UK-SMVIM",
    youtubeUrl: "https://www.youtube.com/watch?v=Gi2UK-SMVIM",
    title:
      "Desi Girl (Lyrics) - Vishal-Shekhar, Shankar Mahadevan, Sunidhi Chauhan, Vishal Dadlani",
  },
  {
    file: "Dhadak 2018 - Dhadak Title Song.mp3",
    query: "Ajay Gogavale, Shreya Ghoshal - Dhadak Title Track - JioSongs.com",
    youtubeId: "3R62Elfbn4g",
    youtubeUrl: "https://www.youtube.com/watch?v=3R62Elfbn4g",
    title: "HEERIYE - A LYRIC SONG",
  },
  {
    file: "Dheera Dheera KGF.mp3",
    query: "n - Dheera Dheera KGF",
    youtubeId: "6FTnjjxmVTE",
    youtubeUrl: "https://www.youtube.com/watch?v=6FTnjjxmVTE",
    title:
      "Dheera Dheera Full Video Song | KGF Kannada Movie | Yash | SrinidhiShetty |Prashanth Neel | Hombale",
  },
  {
    file: "Dil Kyun Yeh Mera - Kites 320 Kbps.mp3",
    query: "Rajesh Roshan, KK - Dil Kyun Yeh Mera",
    youtubeId: "M51OYEo2yjc",
    youtubeUrl: "https://www.youtube.com/watch?v=M51OYEo2yjc",
    title:
      "दिल क्यूं ये मेरा शोर करे पूरा गाना (एचडी) पतंग | रितिक रोशन, बारबरा मोरी",
  },
  {
    file: "Doorie - (Raag.Fm).mp3",
    query: "Atif Aslam (Raag.Fm) - Doorie (Raag.Fm)",
    youtubeId: "CrEamz7APfQ",
    youtubeUrl: "https://www.youtube.com/watch?v=CrEamz7APfQ",
    title:
      "Atif Aslam's Doorie All Song | Audio Jukebox | Bollywood Playback Singer | Atif Aslam Music Playlist",
  },
  {
    file: "Dooriyan Love Aaj Kal 320 Kbps.mp3",
    query: "Pritam, Mohit Chauhan - Dooriyan - PagalNew ",
    youtubeId: "WkkLuQQ_IgY",
    youtubeUrl: "https://www.youtube.com/watch?v=WkkLuQQ_IgY",
    title:
      "Yeh Dooriyan - Lyrical Video | Love Aaj Kal | Kartik Aaryan, Sara Ali Khan | Pritam | Mohit Chauhan",
  },
  {
    file: "Dostana 2008 - Jaane Kyun.mp3",
    query: "Vishal Dadlani - Jaane Kyun - JioSongs.com",
    youtubeId: "n0PoVxBMUyE",
    youtubeUrl: "https://www.youtube.com/watch?v=n0PoVxBMUyE",
    title:
      "Jaane Kyun Full Video - Dostana|John,Abhishek,Priyanka|Vishal Dadlani|Vishal & Shekhar",
  },
  {
    file: "Dosti - RRR.mp3",
    query: "Amit Trivedi (Pagalworld.pw) - Dosti (Pagalworld.pw)",
    youtubeId: "eEuFJXw7j9k",
    youtubeUrl: "https://www.youtube.com/watch?v=eEuFJXw7j9k",
    title:
      "Amit Trivedi's song | Complete Indian culture songs | Mirchi Award function | Must watch.",
  },
  {
    file: "Dur Dur_320(PagalWorld).mp3",
    query: "PagalWorldi.Com - Dur Dur(PagalWorld)",
    youtubeId: "sajJdX_l8qQ",
    youtubeUrl: "https://www.youtube.com/watch?v=sajJdX_l8qQ",
    title:
      "Superfast Breathless Hanuman Chalisa | Hanuman Chalisa New Version | हनुमान चालीसा | Bhagwan Ke Gane",
  },
  {
    file: "Ek Din Aap.mp3",
    query: "pagalworld.com - Ek Din Aap",
    youtubeId: "-yvwawJ9u_M",
    youtubeUrl: "https://www.youtube.com/watch?v=-yvwawJ9u_M",
    title: "Ek Din Aap Yun Humko Mil Jayenge | Alka Yagnik and Kumar Sanu",
  },
  {
    file: "Ek Ladki Ko Dekha 1942 A Love Story 320 Kbps.mp3",
    query: "Kumar Sanu - Ek Ladki Ko Dekha - PagalNew",
    youtubeId: "KMqun-7Rhjk",
    youtubeUrl: "https://www.youtube.com/watch?v=KMqun-7Rhjk",
    title:
      "Tu Deewana Pagal (HD) | Kumar Sanu, Alka Yagnik | तू दीवाना पागल | Manisha Koirala | Anokha Andaaz",
  },
  {
    file: "Ek Ladki Ko Dekha Toh Aisa Laga.mp3",
    query:
      "Darshan Raval - Pagalworld.io - Ek Ladki Ko Dekha Toh Aisa Laga Title Song - Pagalworld.io",
    youtubeId: "IAIGnS9BPKs",
    youtubeUrl: "https://www.youtube.com/watch?v=IAIGnS9BPKs",
    title:
      "Ek Ladki Ko Dekha Toh Aisa Laga | Title Song | Anil | Sonam | Rajkummar Rao | Juhi | Darshan |Rochak",
  },
  {
    file: "Ek_Ladki_ko_dekha_Full_Video_HD_1942_A_love_story_Anil__fTauOK8J-U8_140.mp3",
    query:
      "Ek Ladki ko dekha - Full Video HD | 1942 A love story | Anil Kapoor | Manisha Koirala",
    youtubeId: "CZ5a69wwg5k",
    youtubeUrl: "https://www.youtube.com/watch?v=CZ5a69wwg5k",
    title: "1942 ए लव स्टोरी | एक लड़की को देखा तो | पूरा गाना",
  },
  {
    file: "Extended Version Saari Duniya Jalaa Denge Animal 320 Kbps.mp3",
    query:
      "B Praak, Jaani - Saari Duniya Jalaa Denge Extended Film Version - PagalNew",
    youtubeId: "6OXfgu8uKnE",
    youtubeUrl: "https://www.youtube.com/watch?v=6OXfgu8uKnE",
    title:
      "Saari Duniya Jalaa Denge(Extended Full Song) Ranbir K,Anil K,Bobby D|Sandeep|B Praak,Jaani|Bhushan K",
  },
  {
    file: "Gal Mitthi Mitthi Aisha 128 Kbps.mp3",
    query: "Amit Trivedi, Tochi Raina - Gal Mitthi Mitthi - PagalNew ",
    youtubeId: "xtirmCCJamE",
    youtubeUrl: "https://www.youtube.com/watch?v=xtirmCCJamE",
    title: "Kabira - Tochi Raina, Rekha Bhardwaj |Slowed+Reverb | Lofimix Song",
  },
  {
    file: "Get Ready To Fight - Baaghi (Benny Dayal) 190Kbps.mp3",
    query:
      "Benny Dayal & Siddharth Basrur - PagalWorld.info - Get Ready To Fight - PagalWorld.info",
    youtubeId: "4otLhER8Bv0",
    youtubeUrl: "https://www.youtube.com/watch?v=4otLhER8Bv0",
    title:
      "Get Ready To Fight Video Song   BAAGHI   Hrithik Roshan   Benny Dayal   T Series",
  },
  {
    file: "Get Ready To Fight Again - Baaghi 2.mp3",
    query:
      "Pranaay , Anand Bhaskar, Jatinder Singh, Siddharth Basrur, Big Dhillon - Get Ready To Fight Again (PagalWorld.info)",
    youtubeId: "UMSAmlZtwNo",
    youtubeUrl: "https://www.youtube.com/watch?v=UMSAmlZtwNo",
    title: "get ready to fight. #funny",
  },
  {
    file: "Ghalat Fehmi - Superstar.mp3",
    query:
      "Asim Azhar , Zenab Fatimah Sultan - Pagalworld.Link - Ghalat Fehmi - Pagalworld.Link",
    youtubeId: "yUqjTJd3o4Y",
    youtubeUrl: "https://www.youtube.com/watch?v=yUqjTJd3o4Y",
    title: "Galat Fehmi [LYRICS] - Asim Azhar",
  },
  {
    file: "Ghan-Aaj-Barse-Swapnil-Bandodkar.mp3",
    query: "Swapnil Bandodkar - Ghan Aaj Barse",
    youtubeId: "SMyds5pcrOk",
    youtubeUrl: "https://www.youtube.com/watch?v=SMyds5pcrOk",
    title:
      "Ghan Aaj Barse घन आज बरसे  | स्वप्नील बांदोडकर  | निलेश मोहरीर | Sagarika Music Marathi",
  },
  {
    file: "Ghan-Aaj-Barse.mp3",
    query: "Ghan-Aaj-Barse",
    youtubeId: "SMyds5pcrOk",
    youtubeUrl: "https://www.youtube.com/watch?v=SMyds5pcrOk",
    title:
      "Ghan Aaj Barse घन आज बरसे  | स्वप्नील बांदोडकर  | निलेश मोहरीर | Sagarika Music Marathi",
  },
  {
    file: "Girl I Need You.mp3",
    query: "Meet Bros, Arijit Singh - Girl I Need You",
    youtubeId: "-9fMvHicwLE",
    youtubeUrl: "https://www.youtube.com/watch?v=-9fMvHicwLE",
    title:
      "Girl I Need You Lyrical | BAAGHI | Tiger, Shraddha | Arijit Singh, Meet Bros, Roach Killa, Khushboo",
  },
  {
    file: "Gurupurnima - Dharmaveer- [PagalWorld.NL].mp3",
    query: "Manish Rajgire - Gurupurnima - Dharmaveer - PagalWorld.NL",
    youtubeId: "02ks0Q_ecc0",
    youtubeUrl: "https://www.youtube.com/watch?v=02ks0Q_ecc0",
    title:
      "Gurupurnima | Dharmaveer | Prasad Oak, Kshitish Date | Pravin Tarde | Manish R | Avinash Vishwajeet",
  },
  {
    file: "Ha Chandra Tujhyasathi - Ajay Atul.mp3",
    query:
      "Ajay Atul (PagalWorld.co) - Ha Chandra Tujhyasathi (PagalWorld.click)",
    youtubeId: "JTjjZD5QkHg",
    youtubeUrl: "https://www.youtube.com/watch?v=JTjjZD5QkHg",
    title:
      "Ha Chandra Tujhyasathi Lyrics Video  | हा चंद्र तुझ्यासाठी  | Sagarika Music Marathi",
  },
  {
    file: "Haan Main Taan Haari Re-(PagalSongs.Com.IN).mp3",
    query:
      " Laqshay Kapoor-(PagalSongs.Com.iN) - Haan Main Taan Haari Re-(PagalSongs.Com.IN)",
    youtubeId: "PyBd_ryg08U",
    youtubeUrl: "https://www.youtube.com/watch?v=PyBd_ryg08U",
    title:
      "Meri Hi Na Lag Jaye Nazar Sohneyo | Kala Tikka | Ravneet New Song | Latest Punjabi Song 2021",
  },
  {
    file: "Hamari Adhuri Kahani - Hamari Adhuri Kahani 320 Kbps.mp3",
    query: "Arijit Singh - Hamari Adhuri Kahani",
    youtubeId: "8sqDCkVgMbc",
    youtubeUrl: "https://www.youtube.com/watch?v=8sqDCkVgMbc",
    title: "Arijit Singh - Hamari Adhuri Kahani (Lyrics)",
  },
  {
    file: "Har Har Gange - Batti Gul Meter Chalu 128 Kbps.mp3",
    query: "Arijit Singh - Har Har Gange",
    youtubeId: "PaoeGgJs3Ac",
    youtubeUrl: "https://www.youtube.com/watch?v=PaoeGgJs3Ac",
    title:
      "Arijit Singh: Har Har Gange With Lyrics | Batti Gul Meter Chalu | Shahid Kapoor, Shraddha Kapoor",
  },
  {
    file: "Hasi (Female Version) - Hamari Adhuri Kahani 320 Kbps.mp3",
    query: "Shreya Ghoshal, Ami Mishra - Hasi (Female Version)",
    youtubeId: "Zvp-VBmoPmI",
    youtubeUrl: "https://www.youtube.com/watch?v=Zvp-VBmoPmI",
    title: "Ami Mishra, Shreya Ghoshal - Hasi (Female Version) (Lyric Video)",
  },
  {
    file: "Hasi (Male Version) - Hamari Adhuri Kahani 320 Kbps.mp3",
    query: "Ami Mishra - Hasi (Male Version)",
    youtubeId: "FOkVXadnO88",
    youtubeUrl: "https://www.youtube.com/watch?v=FOkVXadnO88",
    title:
      "Hasi Ban Gaye (Lyrical Video) Male Version | Emraan Hashmi, Vidya Balan | Ami Mishra | Mohit Suri",
  },
  {
    file: "Hawayein Jab Harry Met Sejal (original Motion Picturetrack) 320 Kbps.mp3",
    query: "Pritam, Arijit Singh - Hawayein - PagalNew",
    youtubeId: "cYOB941gyXI",
    youtubeUrl: "https://www.youtube.com/watch?v=cYOB941gyXI",
    title:
      "Hawayein - Lyrical Video | Jab Harry Met Sejal | Shah Rukh Khan, Anushka | Arijit Singh | Pritam",
  },
  {
    file: "Heer Aasmani (Fighter)-(PagalWorld.Com.IN).mp3",
    query:
      "B Praak-(PagalWorld.Com.IN) - Heer Aasmani (Fighter)-(PagalWorld.Com.IN)",
    youtubeId: "69PKYk2Xs94",
    youtubeUrl: "https://www.youtube.com/watch?v=69PKYk2Xs94",
    title: "Heer Aasmani   Fighter ft Hrithik Roshan",
  },
  {
    file: "Heeriye - HHAH (2019).mp3",
    query: "Arijit Singh, Shreya Ghoshal - Heeriye - PagalSongs.com",
    youtubeId: "FdHzKwfPTds",
    youtubeUrl: "https://www.youtube.com/watch?v=FdHzKwfPTds",
    title:
      "Arijit Singh New Songs 2024 Jukebox | Heeriye Heeriye Aa Song Arjit Singh All Songs |New Hindi Songs",
  },
  {
    file: "Hosanna - Ek Deewana Tha.mp3",
    query: "lebewafa.com - Hosanna - Ek Deewana Tha lebewafa.com",
    youtubeId: "klENtbMNsYs",
    youtubeUrl: "https://www.youtube.com/watch?v=klENtbMNsYs",
    title: "Hosanna Full Video Song   Ek Deewana Tha-(LeBeWafa.Com).mp4",
  },
  {
    file: "Hua Main Animal 320 Kbps.mp3",
    query: "Raghav Chaitanya, Manoj Muntashir - Hua Main - PagalNew",
    youtubeId: "ZiiO2WHcPZc",
    youtubeUrl: "https://www.youtube.com/watch?v=ZiiO2WHcPZc",
    title:
      "Hua Main ( Stripped) | Raghav Chaitanya | Ranbir kapoor | Sandeep Vanga |",
  },
  {
    file: "Hum Dum - Shiddat 320 Kbps.mp3",
    query: "Ankit Tiwari - Hum Dum",
    youtubeId: "USGOWMsnIG4",
    youtubeUrl: "https://www.youtube.com/watch?v=USGOWMsnIG4",
    title:
      "Hum Dum (Full Video) | Shiddat | Sunny Kaushal, Radhika Madan | Ankit Tiwari | Gourov Dasgupta",
  },
  {
    file: "Humnava - Hamari Adhuri Kahani 128 Kbps.mp3",
    query: "Papon, Mithoon - Humnava",
    youtubeId: "pP12RCC6Nss",
    youtubeUrl: "https://www.youtube.com/watch?v=pP12RCC6Nss",
    title:
      "Humnava - Lyrical Video | Emraan Hashmi, Vidya Balan | Hamari Adhuri Kahani | Papon",
  },
  {
    file: "Ilahi - Yeh Jawaani Hai Deewani 320 Kbps.mp3",
    query: "Arijit Singh - Ilahi",
    youtubeId: "6uHPT_zXdx4",
    youtubeUrl: "https://www.youtube.com/watch?v=6uHPT_zXdx4",
    title: "Ilahi Lyrics - ARIJIT SINGH | Ilahi mera jee aaye aaye",
  },
  {
    file: "In Dino Life In A Metro 320 Kbps.mp3",
    query: "Pritam, Soham - In Dino - PagalNew ",
    youtubeId: "MdMACkSw9t0",
    youtubeUrl: "https://www.youtube.com/watch?v=MdMACkSw9t0",
    title:
      "Oh My Love With Lyrics |  Raaz 3 I Emraan Hashmi, Esha Gupta, Bipasha Basu",
  },
  {
    file: "Ishq Bulaava.mp3",
    query: "Sanam Puri & Shipra Goyal - Ishq Bulaava - PagalWorld.com",
    youtubeId: "Y9N6zdXdz9A",
    youtubeUrl: "https://www.youtube.com/watch?v=Y9N6zdXdz9A",
    title: "इश्क बुलावा। हंसी तो फंसी-सनम (वैलेंटाइन डे स्पेशल)",
  },
  {
    file: "Jaan ‘Nisaar (Arijit) - Kedarnath 320 Kbps.mp3",
    query: "Jaan ‘Nisaar (Arijit) - Kedarnath 320 Kbps",
    youtubeId: "vdbP_3o73qI",
    youtubeUrl: "https://www.youtube.com/watch?v=vdbP_3o73qI",
    title:
      "Jaan Nisaar - Lyrical | Kedarnath| Arijit Singh | Sushant Singh Rajput | Sara Ali Khan| Amit Trivedi",
  },
  {
    file: "Jab Koi Baat - DJ Chetas _ Full Video _ Ft _ Atif Aslam & Shirley Setia _ Latest Romantic Songs 2018 ( 128kbps ).mp3",
    query:
      "Ishtar Music - Jab Koi Baat - DJ Chetas | Full Video | Ft : Atif Aslam & Shirley Setia | Latest Romantic Songs 2018",
    youtubeId: "rFU28HBP7B0",
    youtubeUrl: "https://www.youtube.com/watch?v=rFU28HBP7B0",
    title:
      "Jab Koi Baat - DJ Chetas | Full Video | Ft : Atif Aslam & Shirley Setia | #RomanticSongs 2018",
  },
  {
    file: "Jagga jiteya Uri - The Surgical Strike - Hindi.mp3",
    query: "Jagga jiteya Uri - The Surgical Strike - Hindi",
    youtubeId: "uTDMVdzIhqQ",
    youtubeUrl: "https://www.youtube.com/watch?v=uTDMVdzIhqQ",
    title:
      "Jagga Jiteya - Full Video | URI | Vicky Kaushal & Yami Gautam | Daler Mehndi, Dee MC & Shashwat S",
  },
  {
    file: "Jagga_Jiteya.mp3",
    query:
      "Daler Mehndi, Dee MC & Shashwat Sachdev - Jagga Jiteya - HindiMp3.Mobi",
    youtubeId: "uTDMVdzIhqQ",
    youtubeUrl: "https://www.youtube.com/watch?v=uTDMVdzIhqQ",
    title:
      "Jagga Jiteya - Full Video | URI | Vicky Kaushal & Yami Gautam | Daler Mehndi, Dee MC & Shashwat S",
  },
  {
    file: "JAI SHRI RAM - BUCKS BOY _ RAM NAVAMI SONG 2021 _ TMT PRODUCTIONS _ RAP SONG _ ( 128kbps ).mp3",
    query:
      "Bucks Boy Music World - JAI SHRI RAM - BUCKS BOY | RAM NAVAMI SONG 2021 | TMT PRODUCTIONS | RAP SONG |",
    youtubeId: "T2mfWhK8QnU",
    youtubeUrl: "https://www.youtube.com/watch?v=T2mfWhK8QnU",
    title:
      "JAY SHREE RAM - BUCKS BOY | RAM NAVAMI SONG 2021 | TMT PRODUCTIONS | RAP SONG |",
  },
  {
    file: "Jaikal Mahakal Reprise Goodbye 128 Kbps.mp3",
    query: "Suhas Sawant - Jaikal Mahakal Reprise - PagalNew ",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Janani - Rrr.mp3",
    query: "M M Keeravani , Chorus (Pagalworld.pw) - Janani ",
    youtubeId: "gdDjtZcwVQE",
    youtubeUrl: "https://www.youtube.com/watch?v=gdDjtZcwVQE",
    title:
      "Railu Bandi Allu Arjun, Aditi Agarwal Telugu Evergreen Melodies Song |  Telugu Videos",
  },
  {
    file: "Jannatein Kahan (Jannat ) - K.K - 320Kbps (1).mp3",
    query: "K.K. (PagalWorld.cool) - Jannatein Kahan - PagalWorld.cool",
    youtubeId: "DaKxyacvPxU",
    youtubeUrl: "https://www.youtube.com/watch?v=DaKxyacvPxU",
    title: "Jannatein Kahan (Lyrics) - Pritam, KK, Mayur Puri",
  },
  {
    file: "Jannatein Kahan Jannat 2 Original Motion Picturetrack 320 Kbps.mp3",
    query: "Pritam, KK - Jannatein Kahan - PagalNew ",
    youtubeId: "rN5i0SaPsLA",
    youtubeUrl: "https://www.youtube.com/watch?v=rN5i0SaPsLA",
    title:
      "Pritam - Jannatein Kahan - Audio | Jannat 2 | Emraan Hashmi | Esha Gupta | KK| Mayur Puri",
  },
  {
    file: "Jashn E Bahara.mp3",
    query: "Javed Ali - Jashn E Bahara - www.hotmentos.com",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Jay-Jaykara - Bahubali 2 - 190Kbps.mp3",
    query: "Kailash Kher - PagalWorld.me - Jay-Jaykara - PagalWorld.cool",
    youtubeId: "41_wDm4EsGQ",
    youtubeUrl: "https://www.youtube.com/watch?v=41_wDm4EsGQ",
    title:
      "'Teri Deewani' पर Kailash Kher & Aryan की रूहानी जुगलबंदी! | Superstar Singer 3 | Viral Performance",
  },
  {
    file: "Jeev Ekata - Marathi Sad Song - Adarsh Shinde, Shilpa Pai - New Marathi Movie Asa Mee Ashi Tee ( 128kbps ).mp3",
    query:
      "Video Palace - Jeev Ekata - Marathi Sad Song - Adarsh Shinde, Shilpa Pai - New Marathi Movie Asa Mee Ashi Tee",
    youtubeId: "MNDpsGBwkGQ",
    youtubeUrl: "https://www.youtube.com/watch?v=MNDpsGBwkGQ",
    title:
      "Jeev Ekata - Marathi Sad Song - Adarsh Shinde, Shilpa Pai - New Marathi Movie Asa Mee Ashi Tee",
  },
  {
    file: "Jhimma---Title-Track-Vaishali-Samant-Mugdha-Karhade-Aarti-Kelkar-Suhas-Joshi.mp3",
    query: "Vaishali Samant - Jhimma - Title Track",
    youtubeId: "NIEpmzvDjRE",
    youtubeUrl: "https://www.youtube.com/watch?v=NIEpmzvDjRE",
    title:
      "Movie time | Jhimma | Marathi movie | khelu jhimma | झिम्मा title song| latest marathi song",
  },
  {
    file: "Jhoom-RB-Mix-Ali-Zafar.mp3",
    query: "Ali Zafar - Jhoom R&B Mix",
    youtubeId: "tfchHFd3CvU",
    youtubeUrl: "https://www.youtube.com/watch?v=tfchHFd3CvU",
    title: "Ali Zafar | Jhoom (R&B mix) | Lyrical Video",
  },
  {
    file: "Jiyein Kyun - Dum Maaro Dum 320 Kbps.mp3",
    query: "Pritam, Papon - Jiyein Kyun",
    youtubeId: "szdRoROQy_c",
    youtubeUrl: "https://www.youtube.com/watch?v=szdRoROQy_c",
    title: "Jiyein Kyun",
  },
  {
    file: "Joy_of_Little_Things_When_Chai_Met_Toast_High_on_Music_lOZOGaN_X4w_140.mp3",
    query: "Joy of Little Things - When Chai Met Toast - High on Music",
    youtubeId: "lOZOGaN_X4w",
    youtubeUrl: "https://www.youtube.com/watch?v=lOZOGaN_X4w",
    title: "Joy of Little Things - When Chai Met Toast - High on Music",
  },
  {
    file: "Judaai Badlapur 128 Kbps.mp3",
    query: "Rekha Bhardwaj, Arijit Singh, Sachin-Jigar - Judaai - PagalNew",
    youtubeId: "t2VaF0ZX65w",
    youtubeUrl: "https://www.youtube.com/watch?v=t2VaF0ZX65w",
    title:
      "जुदाई (ऑडियो सांग) | बदलापुर | वरुण धवन, यामी गौतम और नवाजुद्दीन सिद्दीकी",
  },
  {
    file: "Judaai Badlapur 320 Kbps.mp3",
    query: "Rekha Bhardwaj, Arijit Singh, Sachin-Jigar - Judaai - PagalNew",
    youtubeId: "t2VaF0ZX65w",
    youtubeUrl: "https://www.youtube.com/watch?v=t2VaF0ZX65w",
    title:
      "जुदाई (ऑडियो सांग) | बदलापुर | वरुण धवन, यामी गौतम और नवाजुद्दीन सिद्दीकी",
  },
  {
    file: "Ka-Kalena-Bela-Shende-Swapnil-Bandodkar.mp3",
    query:
      "Bela Shende,Swapnil Bandodkar (Pendu-Jatt.Com) - Ka Kalena (PenduJatt.Com)",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Kaakan_Reprise__ZZzDlXcqqU_140.mp3",
    query: "Kaakan Reprise",
    youtubeId: "_ZZzDlXcqqU",
    youtubeUrl: "https://www.youtube.com/watch?v=_ZZzDlXcqqU",
    title: "Kaakan Reprise",
  },
  {
    file: "Kaakan_Title_Song_Full_Audio_Jitendra_Joshi_Urmila_Koth_7oNdJ_SmD8o_140.mp3",
    query:
      "Kaakan Title Song - Full Audio | Jitendra Joshi & Urmila Kothare | Shankar Mahadevan & Neha Rajpal",
    youtubeId: "7oNdJ_SmD8o",
    youtubeUrl: "https://www.youtube.com/watch?v=7oNdJ_SmD8o",
    title:
      "Kaakan Title Song - Full Audio | Jitendra Joshi & Urmila Kothare | Shankar Mahadevan & Neha Rajpal",
  },
  {
    file: "Kabhi Alvida Naa Kehna - Kabhi Alvida Naa Kehna 128 Kbps.mp3",
    query:
      "Shankar-Ehsaan-Loy, Sonu Nigam, Alka Yagnik - Kabhi Alvida Naa Kehna",
    youtubeId: "nmTp_esz_Q8",
    youtubeUrl: "https://www.youtube.com/watch?v=nmTp_esz_Q8",
    title:
      "Kabhi Alvida Naa Kehna - Lyrical Video | Shah Rukh Khan | Rani Mukherjee | Sonu Nigam | Alka Yagnik",
  },
  {
    file: "Kabhi Kabhi Aditi Zindagi Jaane Tu.. Ya Jaane Na 320 Kbps.mp3",
    query: "Rashid Ali - Kabhi Kabhi Aditi Zindagi - PagalNew ",
    youtubeId: "2Fa8-rhlm2A",
    youtubeUrl: "https://www.youtube.com/watch?v=2Fa8-rhlm2A",
    title: "ओ सजना (वीडियो सांग) | टेबल न. 21 | राजीव खंडेलवाल और टीना देसाई",
  },
  {
    file: "Kadhi Tu (PenduJatt.Com.Se).mp3",
    query: "Kadhi Tu (PenduJatt.Com.Se)",
    youtubeId: "IeyF3vICprk",
    youtubeUrl: "https://www.youtube.com/watch?v=IeyF3vICprk",
    title: "PENDU YAAR (PUNJAB) - OFFICIAL VIDEO - KAMAL HEER",
  },
  {
    file: "Kadhi-Kadhi-Atul-Kale.mp3",
    query: "Kadhi-Kadhi-Atul-Kale",
    youtubeId: "8epEDCU-n24",
    youtubeUrl: "https://www.youtube.com/watch?v=8epEDCU-n24",
    title: "Kadhi Kadhi",
  },
  {
    file: "Kadhi-Kadhi-Javed-Ali.mp3",
    query: "Kadhi-Kadhi-Javed-Ali",
    youtubeId: "UYjRzEyBH8g",
    youtubeUrl: "https://www.youtube.com/watch?v=UYjRzEyBH8g",
    title: "Kadhi Kadhi with lyrics | कधी कधी | Javed Ali",
  },
  {
    file: "Kadhi_Tu_Song_Mumbai_Pune_Mumbai_Romantic_Marathi_Songs_VYdWSp8pIjg_140.mp3",
    query:
      "Kadhi Tu Song - Mumbai Pune Mumbai | Romantic Marathi Songs | Swapnil Joshi, Mukta Barve",
    youtubeId: "Y4TICMyl9Eg",
    youtubeUrl: "https://www.youtube.com/watch?v=Y4TICMyl9Eg",
    title:
      "Kadhi Tu Song with Lyrics | Mumbai Pune Mumbai | Superhit Marathi Song | Swapnil Joshi, Mukta Barve",
  },
  {
    file: "Kahani Laal Singh Chaddha 320 Kbps.mp3",
    query: "Pritam, Mohan Kannan, Amitabh Bhattacharya - Kahani - PagalNew",
    youtubeId: "ZzVyBV9cAXY",
    youtubeUrl: "https://www.youtube.com/watch?v=ZzVyBV9cAXY",
    title: "Kahani",
  },
  {
    file: "Kaise Hua - Kabir Singh 320 Kbps.mp3",
    query: "Vishal Mishra - Kaise Hua",
    youtubeId: "jBfR0bU82z8",
    youtubeUrl: "https://www.youtube.com/watch?v=jBfR0bU82z8",
    title: "Kaise Hua | Vishal Mishra | Live | TKSS",
  },
  {
    file: "Kaise MujheTum Ho Song (Lyrics)  T-Series Mixtape  Palak Muchhal  Aditya Narayan  Bhushan Kumar.mp3",
    query:
      "Kaise MujheTum Ho Song (Lyrics)  T-Series Mixtape  Palak Muchhal  Aditya Narayan  Bhushan Kumar",
    youtubeId: "JzwLTO80WUY",
    youtubeUrl: "https://www.youtube.com/watch?v=JzwLTO80WUY",
    title:
      "Kaise Mujhe/Tum Ho Song (Lyrics) | T-Series Mixtape | Palak Muchhal | Aditya Narayan | Bhushan Kumar",
  },
  {
    file: "Kaise Mujhe_Tum Ho Song _ T-Series Mixtape _ Palak Muchhal _ Aditya Narayan _ Bhushan Kumar ( 128kbps ).mp3",
    query:
      "T-Series - Kaise Mujhe/Tum Ho Song | T-Series Mixtape | Palak Muchhal | Aditya Narayan | Bhushan Kumar",
    youtubeId: "hV_RjHb9034",
    youtubeUrl: "https://www.youtube.com/watch?v=hV_RjHb9034",
    title:
      "Kaise Mujhe/Tum Ho Song | T-Series Mixtape | Palak Muchhal | Aditya Narayan | Bhushan Kumar",
  },
  {
    file: "Kali Kali Zulfon Ke - Madhur Sharma _ Ustad Nusrat Fateh Ali Khan _ Na Chedo Hume Hum Sataye Hue hai.mp3",
    query:
      "Kali Kali Zulfon Ke - Madhur Sharma _ Ustad Nusrat Fateh Ali Khan _ Na Chedo Hume Hum Sataye Hue hai",
    youtubeId: "o-7b6ctrQX0",
    youtubeUrl: "https://www.youtube.com/watch?v=o-7b6ctrQX0",
    title:
      "Kali Kali Zulfon Ke - Madhur Sharma | Ustad Nusrat Fateh Ali Khan | @PearlRecords",
  },
  {
    file: "Ka_Saang_Naa_iCbUHRX_-5E_140.mp3",
    query: "Ka Saang Naa",
    youtubeId: "H1Pjk83uNfI",
    youtubeUrl: "https://www.youtube.com/watch?v=H1Pjk83uNfI",
    title:
      "Ka Saang Na Song Video - Happy Journey | Marathi Songs 2015 | Atul Kulkarni, Pallavi Subhash",
  },
  {
    file: "Khamoshiyan (Arijit Singh) 320Kbps.mp3",
    query:
      "Arijit Singh & Jeet Ganguly - PagalWorld.com - Khamoshiyan - PagalWorld.com",
    youtubeId: "LmnpgSc1tKo",
    youtubeUrl: "https://www.youtube.com/watch?v=LmnpgSc1tKo",
    title: "Arijit Singh | Jeet Gannguli - Khamoshiyan (Lyrics)",
  },
  {
    file: "KK  MTV Unplugged  Beete Lamhein.mp3",
    query: "KK  MTV Unplugged  Beete Lamhein",
    youtubeId: "q2RMKMLmu40",
    youtubeUrl: "https://www.youtube.com/watch?v=q2RMKMLmu40",
    title: "KK | MTV Unplugged | Beete Lamhein",
  },
  {
    file: "KK-Is This Love.mp3",
    query:
      "Mohit Chauhan , Shreya Ghoshal - Is This Love - Kahin Na Laage - www.hotmentos.com",
    youtubeId: "iVOiyD3R-rU",
    youtubeUrl: "https://www.youtube.com/watch?v=iVOiyD3R-rU",
    title: "कहीं ना लगे मन - इज दिस लव - किस्मत कनेक्शन - मोहित चौहान",
  },
  {
    file: "Kyun Main Jaagoon Patiala House 320 Kbps.mp3",
    query:
      "Shankar-Ehsaan-Loy, Shafqat Amanat Ali - Kyun Main Jaagoon - PagalNew ",
    youtubeId: "euzN3QeycN0",
    youtubeUrl: "https://www.youtube.com/watch?v=euzN3QeycN0",
    title:
      "Kyun Main Jaagoon - Shafqat Amanat Ali | (Lyrics) |Akshay Kumar,Anushka Sharma| Patiala House (2011)",
  },
  {
    file: "Lae_Dooba_Lyrical_Aiyaary_Sidharth_Malhotra_Rakul_Preet_lTvrdaYBrXk_140.mp3",
    query:
      "Lae Dooba - Lyrical | Aiyaary | Sidharth Malhotra, Rakul Preet |Sunidhi Chauhan |Rochak Kohli",
    youtubeId: "mxWBW--yoiA",
    youtubeUrl: "https://www.youtube.com/watch?v=mxWBW--yoiA",
    title:
      "Lae Dooba - Full Video | Aiyaary | Sidharth Malhotra, Rakul Preet | Sunidhi Chauhan | Rochak Kohli",
  },
  {
    file: "Lag Ja Gale Se Phir - Woh Kaun Thi  (1964) 128 Kbps.mp3",
    query: "Madan Mohan, Lata Mangeshkar - Lag Ja Gale Se Phir",
    youtubeId: "y2fgw1Oqz28",
    youtubeUrl: "https://www.youtube.com/watch?v=y2fgw1Oqz28",
    title:
      "Lag Ja Gale Ki Phir Ye Haseen Raat Ho Na Ho Video Song | Lata Mangeshkar | Woh Kaun Thi Songs",
  },
  {
    file: "LOCKDOWN BOLLYWOOD WORKOUT MIX 2021 _ LOCKDOWN WORKOUT LATEST SONGS _ HOME WORKOUT MASHUP 2021 ( 128kbps ).mp3",
    query:
      "Desi DJ Adda - LOCKDOWN BOLLYWOOD WORKOUT MIX 2021 | LOCKDOWN WORKOUT LATEST SONGS | HOME WORKOUT MASHUP 2021",
    youtubeId: "V5aad3bE5RI",
    youtubeUrl: "https://www.youtube.com/watch?v=V5aad3bE5RI",
    title:
      "BOLLYWOOD WORKOUT SONGS 2024 NON STOP GYM MUSIC MIX MASHUP REMIXES 2024 | HINDI GYM SONGS NONSTOP",
  },
  {
    file: "Luka Chuppi Rang De Basanti 320 Kbps.mp3",
    query: "Lata Mangeshkar, A.R. Rahman - Luka Chuppi - PagalNew ",
    youtubeId: "T-8vVY-IECk",
    youtubeUrl: "https://www.youtube.com/watch?v=T-8vVY-IECk",
    title:
      "Lyrical | Moh Moh Ke Dhaage (Male) | Song with Lyrics | Dum Laga Ke Haisha | Papon, Anu Malik, Varun",
  },
  {
    file: "Madhubala Amit Trivedi 128 Kbps.mp3",
    query: "Amit Trivedi - Madhubala - PagalNew",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "MAHABHARAT TITLE SONG LYRICS ( 128kbps ).mp3",
    query: "Creator Nik - MAHABHARAT TITLE SONG LYRICS",
    youtubeId: "VH8SVGWXOiw",
    youtubeUrl: "https://www.youtube.com/watch?v=VH8SVGWXOiw",
    title:
      "Mahabharat Unplugged Karaoke | Mahabharat Title Song Karaoke | Unplugged Karaoke With Lyrics",
  },
  {
    file: "Mahi Mera Dil (320 Kbps).mp3",
    query: "Arijit Singh - Mahi Mera Dil (320 Kbps) - [DownloadMing.WS]",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Main Nahi Toh Kaun_192(PagalWorld.com.se).mp3",
    query: "Srushti Tawade - Main Nahi Toh Kaun(PagalWorld.com.se)",
    youtubeId: "RyJW3NbN9XA",
    youtubeUrl: "https://www.youtube.com/watch?v=RyJW3NbN9XA",
    title: "Main nahi toh kaun | Srushti Tawade | Hustle 2.0",
  },
  {
    file: "Main-Rahoon-Ya-Na-Rahoon-Armaan-Malik.mp3",
    query:
      "Armaan Malik (Pendu-Jatt.Com) - Main Rahoon Ya Na Rahoon (PenduJatt.Com)",
    youtubeId: "iTuW1Tm1Zv4",
    youtubeUrl: "https://www.youtube.com/watch?v=iTuW1Tm1Zv4",
    title: "The Rumm song",
  },
  {
    file: "Majha Baji Official Video  Baji  Shreyas Talpade & Amruta Khanvilkar  Chinmayi Sripaada.mp3",
    query:
      "Majha Baji Official Video  Baji  Shreyas Talpade & Amruta Khanvilkar  Chinmayi Sripaada",
    youtubeId: "7-19_aMZd2M",
    youtubeUrl: "https://www.youtube.com/watch?v=7-19_aMZd2M",
    title:
      "Majha Baji Official Video | Baji | Shreyas Talpade & Amruta Khanvilkar | Chinmayi Sripaada",
  },
  {
    file: "Majhya-Raja-Ra-Adarsh-Shinde.mp3",
    query: "Adarsh Shinde - Majhya Raja Ra",
    youtubeId: "nCvaPWoFEl8",
    youtubeUrl: "https://www.youtube.com/watch?v=nCvaPWoFEl8",
    title:
      "Majhya Raja Ra Song - Baghtos Kay Mujra Kar | Adarsh Shinde | Amitraj | Shivaji Maharaj Marathi Song",
  },
  {
    file: "Majhya_Raja_Ra_Lofi_Adarsh_Shinde_Yadnesh_D_Textaudio_L_xMqs4eDJluE_140.mp3",
    query:
      "Majhya Raja Ra [Lofi]-Adarsh Shinde |@Yadnesh D  | Textaudio Lyrics",
    youtubeId: "O5zJdaY6hSQ",
    youtubeUrl: "https://www.youtube.com/watch?v=O5zJdaY6hSQ",
    title: "Majhya Raja Ra [Lofi]-Adarsh Shinde |@Yadnesh D | LOFI FEEL",
  },
  {
    file: "majiya_priyala_Prit_Kalena_title_song_6t5qQiWr4b4_140.mp3",
    query: "majiya priyala Prit Kalena title song",
    youtubeId: "lSERB0WP_zs",
    youtubeUrl: "https://www.youtube.com/watch?v=lSERB0WP_zs",
    title:
      "Mazhiya Priyala Preet Kalena - Title Track | Swapnil Bandodkar, Mahalakshmi Iyer",
  },
  {
    file: "Makhmali.mp3",
    query: "Suraj-Dhiraj - Makhmali",
    youtubeId: "55smvcXH4qM",
    youtubeUrl: "https://www.youtube.com/watch?v=55smvcXH4qM",
    title: "Makhmali  Zindagi Virat Win & DJ Omy composer Suraj Dhiraj",
  },
  {
    file: "Man Bharya 2.mp3",
    query: "B Praak (Pagalworld.pw) - Mann Bharryaa 2 (Pagalworld.pw)",
    youtubeId: "YrUqw7uspKg",
    youtubeUrl: "https://www.youtube.com/watch?v=YrUqw7uspKg",
    title:
      "Mann Bharrya (Full Song) | B Praak | Jaani | Himanshi Khurana | Arvindr Khaira | Punjabi Songs",
  },
  {
    file: "Mangal Bhavan Amangal Haari Ramayan Title Song ramayan arun govil ( 128kbps ).mp3",
    query:
      "CHOUKSEY KARTIKEY - Mangal Bhavan Amangal Haari Ramayan Title Song ramayan arun govil",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Mann Bharryaa 2 - Shershaah.mp3",
    query: "B Praak (Pagalworld.pw) - Mann Bharryaa 2 (Pagalworld.pw)",
    youtubeId: "YrUqw7uspKg",
    youtubeUrl: "https://www.youtube.com/watch?v=YrUqw7uspKg",
    title:
      "Mann Bharrya (Full Song) | B Praak | Jaani | Himanshi Khurana | Arvindr Khaira | Punjabi Songs",
  },
  {
    file: "Manzar_Hai_Ye_Naya.mp3",
    query:
      "Shashwat Sachdev & Shantanu Sudame - Manzar Hai Ye Naya - HindiMp3.Mobi",
    youtubeId: "7sP7Hrxd4qI",
    youtubeUrl: "https://www.youtube.com/watch?v=7sP7Hrxd4qI",
    title:
      "Manzar Hai Yeh Naya - Lyrical | URI | Vicky Kaushal, Yami Gautam | Shantanu, Shashwat | By LyricPop",
  },
  {
    file: "Mar Jaayen Full Loveshhuda 320 Kbps.mp3",
    query: "Mithoon, Parichay - Mar Jaayen Full - PagalNew",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Maula Maula - Romantic Song - New Marathi Movie Asa Mee Ashi Tee - Javed Ali & Shilpa Pai ( 128kbps ).mp3",
    query:
      "Video Palace - Maula Maula - Romantic Song - New Marathi Movie Asa Mee Ashi Tee - Javed Ali & Shilpa Pai",
    youtubeId: "tw44czzUFZ0",
    youtubeUrl: "https://www.youtube.com/watch?v=tw44czzUFZ0",
    title:
      "Maula Maula - Romantic Song - New Marathi Movie Asa Mee Ashi Tee - Javed Ali & Shilpa Pai",
  },
  {
    file: "Maula Mere Lele Meri Jaan Chak De India 320 Kbps.mp3",
    query:
      "Salim-Sulaiman, Jaideep Sahni - Maula Mere Lele Meri Jaan - PagalNew ",
    youtubeId: "i_FmOdPF96E",
    youtubeUrl: "https://www.youtube.com/watch?v=i_FmOdPF96E",
    title:
      "Maula Mere Le Le Meri Jaan - Chak De India | Shah Rukh Khan | Krishna | Salim Merchant",
  },
  {
    file: "Mazya Marathi Maticha _ Kusumagraj _ Ashok Bagwe #marathibhashadin #lekhani4u.mp3",
    query:
      "Mazya Marathi Maticha _ Kusumagraj _ Ashok Bagwe #marathibhashadin #lekhani4u",
    youtubeId: "Dlc5JOmMEeg",
    youtubeUrl: "https://www.youtube.com/watch?v=Dlc5JOmMEeg",
    title:
      "Mazya Marathi Maticha | Kusumagraj | Ashok Bagwe #marathibhashadin #lekhani4u",
  },
  {
    file: "Meray Paas Tum Ho OST _ Rahat Fateh Ali Khan _ Humayun Saeed & Ayeza Khan ( 128kbps ).mp3",
    query:
      "ARY Digital - Meray Paas Tum Ho OST | Rahat Fateh Ali Khan | Humayun Saeed & Ayeza Khan",
    youtubeId: "3CB_nr1ORnw",
    youtubeUrl: "https://www.youtube.com/watch?v=3CB_nr1ORnw",
    title:
      "Meray Pass Tum Ho | COMPLETE OST | Rahat Fateh Ali Khan #pakistanidramaost",
  },
  {
    file: "Mere Bina Crook 320 Kbps.mp3",
    query: "Pritam, Nikhil D&#039;souza - Mere Bina - PagalNew ",
    youtubeId: "jNApc96BLkQ",
    youtubeUrl: "https://www.youtube.com/watch?v=jNApc96BLkQ",
    title:
      "Mere Bina - Vocals Only | Nikhil D'Souza | Emraan Hashmi, Neha Sharma | Pritam | Crook",
  },
  {
    file: "Mere Ghar Ram Aaye Hain - Jubin Nautiyal 128 Kbps.mp3",
    query:
      "Jubin Nautiyal, Payal Dev, Manoj Muntashir - Mere Ghar Ram Aaye Hain - Jubin Nautiyal",
    youtubeId: "vBJ5HSs-N9o",
    youtubeUrl: "https://www.youtube.com/watch?v=vBJ5HSs-N9o",
    title:
      "Jubin Nautiyal: Mere Ghar Ram Aaye Hain | Payal Dev | Manoj Muntashir, Dipika C, Lovesh N |Bhushan K",
  },
  {
    file: "Mere Samnewali Khidki Mein - Padosan (1968) 320 Kbps.mp3",
    query: "R.D. Burman - Mere Samnewali Khidki Mein",
    youtubeId: "gmLEWdJcyLc",
    youtubeUrl: "https://www.youtube.com/watch?v=gmLEWdJcyLc",
    title:
      "Mere Saamne Wali Khidki Mein Karaoke With Scrolling Lyrics Eng. & हिंदी",
  },
  {
    file: "Meri Aashiqui Aashiqui 2 320 Kbps.mp3",
    query: "Palak Muchhal, Arijit Singh - Meri Aashiqui - PagalNew ",
    youtubeId: "jfh7ZKHxNTI",
    youtubeUrl: "https://www.youtube.com/watch?v=jfh7ZKHxNTI",
    title:
      "Meri Aashiqui (Lyrical) - Arijit Singh & Palak Muchhal |Ashiqui 2| Bollywood Songs",
  },
  {
    file: "Meri Duniya Tu Hi Re - Heyy Babyy 128 Kbps.mp3",
    query:
      "Shankar-Ehsaan-Loy, Sonu Nigam, Shaan, Shankar Mahadevan - Meri Duniya Tu Hi Re",
    youtubeId: "vCvzc2LSlWw",
    youtubeUrl: "https://www.youtube.com/watch?v=vCvzc2LSlWw",
    title:
      "Lyrical: MERI DUNIYA TU HI RE | Heyy Babyy | Akshay Kumar, Ritesh Deshmukh, Fardeen Khan",
  },
  {
    file: "Mila Na Tu -Lyrics Video I TAISH I Kriti k,Jim Sarbh,Sanjeeda,Harshvardhan, Pulkit I Baksheesh Singh ( 128kbps ).mp3",
    query:
      "Dot Music Collective - Mila Na Tu -Lyrics Video I TAISH I Kriti k,Jim Sarbh,Sanjeeda,Harshvardhan, Pulkit I Baksheesh Singh",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Mitwa - Shahrukh Khan.mp3",
    query:
      "Caralisa Monteiro, Shankar Mahadevan, Shafqat Amanat Ali, Shankar-Ehsaan-Loy - Mitwa - PagalWorld.com",
    youtubeId: "Suv5QfWKaaw",
    youtubeUrl: "https://www.youtube.com/watch?v=Suv5QfWKaaw",
    title:
      "Shankar Ehsaan Loy, Shankar Mahadevan, Caralisa Monteiro - Mitwa (Lyrics)",
  },
  {
    file: "MMere Dholna.mp3",
    query: "pagalworld.com - Mere Dholna",
    youtubeId: "lL0ULDPCqIA",
    youtubeUrl: "https://www.youtube.com/watch?v=lL0ULDPCqIA",
    title:
      "Lyrical: Mere Dholna | Bhool Bhulaiyaa | Vidya Balan | Shreya Ghoshal, M.G. Sreekumar |  Pritam",
  },
  {
    file: "Moh Moh Ke Dhaage (Female) - Dum Laga Ke Haisha 320 Kbps.mp3",
    query: "Monali Thakur, Anu Malik - Moh Moh Ke Dhaage (Female)",
    youtubeId: "JbDktrsnH40",
    youtubeUrl: "https://www.youtube.com/watch?v=JbDktrsnH40",
    title: "गीतमय: मोह मोह के धागे (महिला) बोल के साथ गाना | दम लगा के हईशा",
  },
  {
    file: "Moh Moh Ke Dhaage Male Dum Laga Ke Haisha 320 Kbps.mp3",
    query:
      "Papon, Anu Malik, Varun Grover - Moh Moh Ke Dhaage (Male) - PagalNew",
    youtubeId: "T-8vVY-IECk",
    youtubeUrl: "https://www.youtube.com/watch?v=T-8vVY-IECk",
    title:
      "Lyrical: Moh Moh Ke Dhaage (Male) Song with Lyrics | Dum Laga Ke Haisha | Ayushmann Khurrana",
  },
  {
    file: "Morya-Morya-Ajay-Gogavale.mp3",
    query: "Ajay Gogavale (Pendu-Jatt.Com) - Morya Morya (PenduJatt.Com)",
    youtubeId: "nx0J-I5-Y8A",
    youtubeUrl: "https://www.youtube.com/watch?v=nx0J-I5-Y8A",
    title:
      "Lord Ganesha Wall Painting || Acrylic Painting || Paintcore92 || Ganpati Bappa Morya ||",
  },
  {
    file: "Mpm Theme (PenduJatt.Com.Se).mp3",
    query: "Mpm Theme (PenduJatt.Com.Se)",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Mudda_Asa_Roop_Nagar_Ke_Cheetey_Gowri_L_Shaan_R_Karan_K_K4gcVsqHT-A_140.mp3",
    query:
      "Mudda Asa | Roop Nagar Ke Cheetey |Gowri L & Shaan R |Karan Kunal, Hemal, Aayushi, Mugdha & Sana",
    youtubeId: "K4gcVsqHT-A",
    youtubeUrl: "https://www.youtube.com/watch?v=K4gcVsqHT-A",
    title:
      "Mudda Asa | Roop Nagar Ke Cheetey |Gowri L & Shaan R |Karan Kunal, Hemal, Aayushi, Mugdha & Sana",
  },
  {
    file: "MUDDA_ASA_Roop_Nagar_Ke_Cheetey_RCzau1AFc3g_140.mp3",
    query: "MUDDA ASA ||Roop Nagar Ke Cheetey",
    youtubeId: "K4gcVsqHT-A",
    youtubeUrl: "https://www.youtube.com/watch?v=K4gcVsqHT-A",
    title:
      "Mudda Asa | Roop Nagar Ke Cheetey |Gowri L & Shaan R |Karan Kunal, Hemal, Aayushi, Mugdha & Sana",
  },
  {
    file: "Mujh Mein Tu Special 26 320 Kbps.mp3",
    query: "M. M. Keeravani, Keerthi Sagathia - Mujh Mein Tu - PagalNew ",
    youtubeId: "iWjMhxmPZLU",
    youtubeUrl: "https://www.youtube.com/watch?v=iWjMhxmPZLU",
    title:
      "Special 26: Mujh Mein Tu 8K Full Video | Akshay Kumar | Kajal Aggarwal | Keerthi S | M.M. Kreem",
  },
  {
    file: "new_320_01 - Tu Hi Re - Bombay (1995).mp3",
    query: "Hari Haran, Kavita Krishnamurthy - Tu Hi Re - PagalSongs.com",
    youtubeId: "V9mN0qBgEzQ",
    youtubeUrl: "https://www.youtube.com/watch?v=V9mN0qBgEzQ",
    title:
      "Tu Hi Re (Lyrical Video) | A. R. Rahman | Hariharan, Kavita Krishnamurthy | Revibe | Hindi Songs",
  },
  {
    file: "Nigahon Main Dekho Meri Jo Hai Bas gya  Atif Aslam  Love Song.mp3",
    query: "Nigahon Main Dekho Meri Jo Hai Bas gya  Atif Aslam  Love Song",
    youtubeId: "EHCG8kno2Lg",
    youtubeUrl: "https://www.youtube.com/watch?v=EHCG8kno2Lg",
    title:
      "Tu Jaane Na - Lyrical | Ajab Prem Ki Ghazab Kahani | Atif Aslam | Ranbir Kapoor, Katrina",
  },
  {
    file: "Night Changes (Slowed Reverb)_320(PaglaSongs).mp3",
    query: "PaglaSongs.Com - Night Changes (Slowed Reverb)(PaglaSongs)",
    youtubeId: "1r444goH-1s",
    youtubeUrl: "https://www.youtube.com/watch?v=1r444goH-1s",
    title:
      "Pagla Pagli - [ Slowed + Reverb ] Bhojpuri Lofi | S.G Creation | #shilpi",
  },
  {
    file: "Night Changes One Direction(MrSong.In).mp3",
    query: "DJSongi.Com - Night Changes One Direction(MrSong.In)",
    youtubeId: "H78YW7ycuwI",
    youtubeUrl: "https://www.youtube.com/watch?v=H78YW7ycuwI",
    title: 'Avicii - The Nights (Lyrics) "my father told me"',
  },
  {
    file: "Non-Stop Road Trip Jukebox  SICKVED  Best Travelling Songs  Bollywood.mp3",
    query:
      "Non-Stop Road Trip Jukebox  SICKVED  Best Travelling Songs  Bollywood",
    youtubeId: "YwEKIl3qQzA",
    youtubeUrl: "https://www.youtube.com/watch?v=YwEKIl3qQzA",
    title:
      "Non-Stop Road Trip Jukebox | SICKVED | Best Travelling Songs | Bollywood",
  },
  {
    file: "O Rangrez Bhaag Milkha Bhaag 320 Kbps.mp3",
    query:
      "Shankar-Ehsaan-Loy, Shreya Ghoshal, Javed Bashir, Yusuf Mohammed, Vajid Ali - O Rangrez - PagalNew ",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "O RE PIYA (LYRICS) _ RAHAT FATEH ALI KHAN _ SALIM-SULAIMAN _ SANDEEP S _ MADHURI DIXIT _ AAJA NACHLE ( 128kbps ).mp3",
    query:
      "Lyrics Lovers - O RE PIYA (LYRICS) | RAHAT FATEH ALI KHAN | SALIM-SULAIMAN | SANDEEP S | MADHURI DIXIT | AAJA NACHLE",
    youtubeId: "PyDexb79g0U",
    youtubeUrl: "https://www.youtube.com/watch?v=PyDexb79g0U",
    title: "O re piya 8D Lyrical song।। Rahat Fateh Ali Khan ।। gana lover",
  },
  {
    file: "old_DMD-Te Amo.mp3",
    query: "Ash King , Sunidhi Chauhan - Te Amo - www.hotmentos.com",
    youtubeId: "3N3n23loy24",
    youtubeUrl: "https://www.youtube.com/watch?v=3N3n23loy24",
    title: '"ते एमो" दम मारो दम (पूरा गाना) | बिपाशा बसु, राणा दग्गुबाती',
  },
  {
    file: "old_Ghajini - Kaise Mujhe.mp3",
    query:
      "Benny Dayal , Shreya Ghoshal - Kaise Mujhe Tu Mil Gayi - www.hotmentos.com",
    youtubeId: "VNYzdRM9E-4",
    youtubeUrl: "https://www.youtube.com/watch?v=VNYzdRM9E-4",
    title:
      "Kaise Mujhe Tu Mil Gayi Female Version (Shreya Ghoshal)- Gajini HD 720p",
  },
  {
    file: "old_Masoom-Tujhse Naraaz Nahin.mp3",
    query: "Anup Ghoshal - Tujhse Naraaz Nahin Zindagi - www.hotmentos.com",
    youtubeId: "GQLnC6ds44k",
    youtubeUrl: "https://www.youtube.com/watch?v=GQLnC6ds44k",
    title:
      "Tujhse Naraz Nahi Zindagi (Make) – Full song | Anup Ghosal | Masoom [1983]",
  },
  {
    file: "old_MNIK-Noor E Khuda.mp3",
    query:
      "Adnan Sami , Shankar Mahadevan , Shreya Ghoshal - Noor E Khuda - www.hotmentos.com",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "old_Rockstar-Phir Se Ud Chala.mp3",
    query: "Mohit Chauhan - Phir Se Ud Chala - www.hotmentos.com",
    youtubeId: "QrLnqWrhoh4",
    youtubeUrl: "https://www.youtube.com/watch?v=QrLnqWrhoh4",
    title: "A R  Rahman MTV Unplugged Phir Se Udd Chala",
  },
  {
    file: "old_Satyamev Jayate-O Ri Chiraiya.mp3",
    query: "Swanand Kirkire - O Ri Chiraiya - www.hotmentos.com",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Pahile-Na-Mi-Tula.mp3",
    query: "Pahile-Na-Mi-Tula",
    youtubeId: "rJqIVdzeXlI",
    youtubeUrl: "https://www.youtube.com/watch?v=rJqIVdzeXlI",
    title:
      "पाहिले ना मी तुला(Pahile Na Me Tula) | Marathi Romantic Song | Ranjana | Ashok Saraf | Kuldeep Pawar",
  },
  {
    file: "Pailwan Ala Ho _ Kesari (Saffron) _ Virat M, Mahesh M, Vikram G, Mohan J _ Yugg Bhaawa ( 128kbps ).mp3",
    query:
      "Bhavna Films - Pailwan Ala Ho | Kesari (Saffron) | Virat M, Mahesh M, Vikram G, Mohan J | Yugg Bhaawa",
    youtubeId: "syacqxwCNwM",
    youtubeUrl: "https://www.youtube.com/watch?v=syacqxwCNwM",
    title:
      "Pailwan Ala Ho | Kesari (Saffron) | Virat M, Mahesh M, Vikram G, Mohan J | Yugg Bhaawa",
  },
  {
    file: "Papa Meri Jaan - Animal-(PagalWorld.Com.IN).mp3",
    query:
      "Sonu Nigam-(PagalWorld.Com.IN) - Papa Meri Jaan - Animal-(PagalWorld.Com.IN)",
    youtubeId: "dTZIa4BnpGE",
    youtubeUrl: "https://www.youtube.com/watch?v=dTZIa4BnpGE",
    title:
      "ANIMAL: Papa Meri Jaan (Full Video) Ranbir Kapoor |Anil K,Rashmika M |Sandeep V|Sonu Nigam|Bhushan K",
  },
  {
    file: "Papa Meri Jaan Animal 320 Kbps.mp3",
    query: "Sonu Nigam - Papa Meri Jaan - PagalNew",
    youtubeId: "bhRswBsogNw",
    youtubeUrl: "https://www.youtube.com/watch?v=bhRswBsogNw",
    title: "पापा मेरे पापा (पूरा गाना) | मैं ऐसा ही हूं | सुष्मिता सेन",
  },
  {
    file: "Patiala House-Kyun Main(Unpluged).mp3",
    query:
      "Shafqat Amanat Ali - Kyun Main Jaagoon (Unpluged) - www.hotmentos.com",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Patiala House-Kyun Main.mp3",
    query: "Shafqat Amanat Ali - Kyun Main Jaagoon - www.hotmentos.com",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Payee Fufata - Lagan- [PagalWorld.NL].mp3",
    query: "Ajay Gogavale - Payee Fufata - Lagan - PagalWorld.NL",
    youtubeId: "X5THyXnyxv4",
    youtubeUrl: "https://www.youtube.com/watch?v=X5THyXnyxv4",
    title:
      "LAGAN - Payee Fufata Official Video Song | Film Version | Ajay Gogavale | Guru Thakur | Arjun Gujar",
  },
  {
    file: "Pehle Bhi Main Animal 320 Kbps.mp3",
    query: "Vishal Mishra, Raj Shekhar - Pehle Bhi Main - PagalNew ",
    youtubeId: "iAIBF2ngbWY",
    youtubeUrl: "https://www.youtube.com/watch?v=iAIBF2ngbWY",
    title:
      "ANIMAL:Pehle Bhi Main(Full Video) | Ranbir Kapoor,Tripti Dimri |Sandeep V |Vishal M,Raj S |Bhushan K",
  },
  {
    file: "Phir Se Ud Chala.mp3",
    query: "Mohit Chauhan - Phir Se Ud Chala",
    youtubeId: "2mWaqsC3U7k",
    youtubeUrl: "https://www.youtube.com/watch?v=2mWaqsC3U7k",
    title: '"फिर से उड़ चला पूरा गाना रॉकस्टार" | रणबीर कपूर',
  },
  {
    file: "Phite Andharache Jale (PenduJatt.Com.Se).mp3",
    query: "Sudhir Phadke, Asha Bhosle - Phite Andharache Jale",
    youtubeId: "SGZXkdpqLgM",
    youtubeUrl: "https://www.youtube.com/watch?v=SGZXkdpqLgM",
    title:
      "Phite Andharache Jaale with lyrics | फिटे अंधाराचे जाळे | Sudhir Phadke |Asha Bhosle| Laxmichi Paule",
  },
  {
    file: "Phite Andharache Jale (Shridhar Phadke Sangeet Sandhya - Ritu Hirwa) - Ishtar Regional.mp3",
    query:
      "Ishtar Regional - Phite Andharache Jale (Shridhar Phadke Sangeet Sandhya - Ritu Hirwa)",
    youtubeId: "GKOEi9p_VaM",
    youtubeUrl: "https://www.youtube.com/watch?v=GKOEi9p_VaM",
    title:
      "Phite Andharache Jale (Shridhar Phadke Sangeet Sandhya - Ritu Hirwa)",
  },
  {
    file: "phite-andharache-jale-shridhar-phadke-sangeet-sandhya-ritu-hirwa-ishtar-region_g8VXi8fA.mp3",
    query:
      "Ishtar Regional - Phite Andharache Jale (Shridhar Phadke Sangeet Sandhya - Ritu Hirwa)",
    youtubeId: "GKOEi9p_VaM",
    youtubeUrl: "https://www.youtube.com/watch?v=GKOEi9p_VaM",
    title:
      "Phite Andharache Jale (Shridhar Phadke Sangeet Sandhya - Ritu Hirwa)",
  },
  {
    file: "Piyush Mishra Manoj Vajpayee Vo Purane Din । वो पुराने दिन । मनोज वाजपेयी पीयूष मिश्रा । Rare video ( 128kbps ).mp3",
    query:
      "ZILLI REACTION - Piyush Mishra Manoj Vajpayee Vo Purane Din । वो पुराने दिन । मनोज वाजपेयी पीयूष मिश्रा । Rare video",
    youtubeId: "K121IFIRC1M",
    youtubeUrl: "https://www.youtube.com/watch?v=K121IFIRC1M",
    title:
      'Top Real Team "AAMIR TRT" |Comedy video | Top Real Team New Comedy | REACTION | SWEET CHILIZ |',
  },
  {
    file: "play.mp3",
    query: "play",
    youtubeId: "YQRHrco73g4",
    youtubeUrl: "https://www.youtube.com/watch?v=YQRHrco73g4",
    title: "Alan Walker, K-391, Tungevaag, Mangoo - PLAY (Alan Walker's Video)",
  },
  {
    file: "Pretty Woman Kal Ho Naa Ho 128 Kbps.mp3",
    query:
      "Shankar-Ehsaan-Loy, Shankar Mahadevan, Ravi &quot;Rags&quot; Khote - Pretty Woman - PagalNew ",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Pritam_Mere_Bina_Unplugged_Best_Audio_Song_Crook_Emraan_l2CoZZy3meA_140.mp3",
    query:
      "Pritam - Mere Bina (Unplugged) Best Audio Song|Crook|Emraan Hashmi|Neha Sharma|Kumaar",
    youtubeId: "l2CoZZy3meA",
    youtubeUrl: "https://www.youtube.com/watch?v=l2CoZZy3meA",
    title:
      "Pritam - Mere Bina (Unplugged) Best Audio Song|Crook|Emraan Hashmi|Neha Sharma|Kumaar",
  },
  {
    file: "Qismat-Ammy-Virk.mp3",
    query: "Ammy Virk VlcMusic.CoM - Qismat VlcMusic.CoM",
    youtubeId: "9iBjKNtpJEc",
    youtubeUrl: "https://www.youtube.com/watch?v=9iBjKNtpJEc",
    title:
      "Upar Pankha Chalta Hai Song | Mann Raaj | Latest Hindi Song 2022 | Party Shuru Song | New Rap Music",
  },
  {
    file: "Raabta - Title Song (Arijit Singh) 320Kbps.mp3",
    query:
      "Pritam, Arijit Singh , Nikita Gandhi - PagalWorld.cool - Raabta (Title Track) - PagalWorld.cool",
    youtubeId: "tpYZZIEO-f0",
    youtubeUrl: "https://www.youtube.com/watch?v=tpYZZIEO-f0",
    title:
      "Raabta Title Song Lyrical | Deepika Padukone,Arijit Singh|Sushant Singh Rajput, Kriti Sanon |Pritam",
  },
  {
    file: "Radha Radha Mazi Radha Kuthe Geli(PagalWorld).mp3",
    query:
      " Swapnil Bandodkar(www.PagalWorld.com.es) - Radha Radha Mazi Radha Kuthe Geli(PagalWorld)",
    youtubeId: "lGUuLgT2Jj4",
    youtubeUrl: "https://www.youtube.com/watch?v=lGUuLgT2Jj4",
    title:
      "Radha Radha | Swapnil Bandodkar | Urmilla Kanitkar | Sagarika Music Maratahi",
  },
  {
    file: "Radha Student Of The Year 320 Kbps.mp3",
    query:
      "Vishal-Shekhar, Shreya Ghoshal, Udit Narayan, Vishal Dadlani, Shekhar Ravjiani - Radha - PagalNew ",
    youtubeId: "EIdVTM1lefk",
    youtubeUrl: "https://www.youtube.com/watch?v=EIdVTM1lefk",
    title:
      "Radha - 8K/4K Music Video | Alia, Varun, Sidharth | Shreya Ghoshal | Udit Narayan | SOTY",
  },
  {
    file: "Raftaarein_ Song With Lyrics _ Ra.One _ Shahrukh Khan, Kareena Kapoor ( 128kbps ).mp3",
    query:
      "T-Series - Raftaarein Song With Lyrics  | Shahrukh Khan, Kareena Kapoor",
    youtubeId: "4G5ScpHkuLA",
    youtubeUrl: "https://www.youtube.com/watch?v=4G5ScpHkuLA",
    title:
      '"Raftaarein" Song With Lyrics | Ra.One | Shahrukh Khan, Kareena Kapoor',
  },
  {
    file: "Raja Aala_320(PagalWorldl).mp3",
    query: "PagalWorldl.Com - Raja Aala(PagalWorldl)",
    youtubeId: "zTRgEVNuLRs",
    youtubeUrl: "https://www.youtube.com/watch?v=zTRgEVNuLRs",
    title:
      "Raja Aala Lyrical Song - Pawankhind | पावनखिंड | Chinmay Mandlekar | Digpal Lanjekar",
  },
  {
    file: "Rang Lageya - Mohit Chauhan_320(PagalWorldl).mp3",
    query: "PagalWorldl.Com - Rang Lageya - Mohit Chauhan(PagalWorldl)",
    youtubeId: "70m3GEg8714",
    youtubeUrl: "https://www.youtube.com/watch?v=70m3GEg8714",
    title: "Rang Lageya || Ishq Da || (Slowed+Reverb) || Song by Mohit Chauhan",
  },
  {
    file: "Rani-nighta-shuur.mp3",
    query:
      "Rani nighta shuur | रणी निघता शूर | audio/Mp3 | PAVANKHIND | पावनखिंड",
    youtubeId: "aj6kuXMo0tY",
    youtubeUrl: "https://www.youtube.com/watch?v=aj6kuXMo0tY",
    title:
      "Rani Nighta Shur - Video Song | Pawankhind | Marathi Song 2022 | Chinmay Mandlekar |Digpal Lanjekar",
  },
  {
    file: "ReelAudio-15433.mp3",
    query: "ReelAudio-15433",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Saad Hi Preetichi (PenduJatt.Com.Se).mp3",
    query: "Saad Hi Preetichi (PenduJatt.Com.Se)",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Saang-Na-Shekhar-Ravjiani.mp3",
    query: "Saang-Na-Shekhar-Ravjiani",
    youtubeId: "GfHbIgkeAIs",
    youtubeUrl: "https://www.youtube.com/watch?v=GfHbIgkeAIs",
    title:
      "Saang Na - Classmates - Latest Marathi Sad Song - Sai Tamhankar, Ankush Chaudhari",
  },
  {
    file: "Saang_Naa_Lyrics_Classmates_Marathi_Movie__VnTytMx1MrY_140.mp3",
    query: "Saang Naa |Lyrics | Classmates Marathi Movie|",
    youtubeId: "GfHbIgkeAIs",
    youtubeUrl: "https://www.youtube.com/watch?v=GfHbIgkeAIs",
    title:
      "Saang Na - Classmates - Latest Marathi Sad Song - Sai Tamhankar, Ankush Chaudhari",
  },
  {
    file: "Saanson Ne Dabangg 2 320 Kbps.mp3",
    query: "Sajid-Wajid, Sonu Nigam, Tulsi Kumar - Saanson Ne - PagalNew ",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Saari Duniya Jalaa Denge Animal 320 Kbps.mp3",
    query: "Jaani, B Praak - Saari Duniya Jalaa Denge - PagalNew ",
    youtubeId: "8A1XPxaeoZA",
    youtubeUrl: "https://www.youtube.com/watch?v=8A1XPxaeoZA",
    title:
      "ANIMAL: Saari Duniya Jalaa Denge (Film Version) 8K |Ranbir K,Bobby D,Sandeep,B Praak,Jaani,Bhushan K",
  },
  {
    file: "Saath De Tu Mala (PenduJatt.Com.Se).mp3",
    query: "Saath De Tu Mala (PenduJatt.Com.Se)",
    youtubeId: "ls5MDE7Hgmc",
    youtubeUrl: "https://www.youtube.com/watch?v=ls5MDE7Hgmc",
    title:
      "Gurlej Akhtar - Jeda Vekhda Kanna Nu Hath Laaven Saat Pind Saakh Mang De | Latest Punjabi Song 2018",
  },
  {
    file: "Saavli (PenduJatt.Com.Se).mp3",
    query: "Saavli (PenduJatt.Com.Se)",
    youtubeId: "QR2ozhegJpc",
    youtubeUrl: "https://www.youtube.com/watch?v=QR2ozhegJpc",
    title:
      "Bullet Wali Song | बुलेट वाली | Full video | Sunju Rathod, Sonali Sonawane | Darshan R | Shraddha T",
  },
  {
    file: "Saavli Official Video. http___bit.ly_SaavliiTunes & http___bit.ly_SaavliDownload ( 128kbps ).mp3",
    query:
      "Shekhar Ravjiani Official - Saavli Official Video. http://bit.ly/SaavliiTunes & http://bit.ly/SaavliDownload",
    youtubeId: "e9FuRpIO-Ws",
    youtubeUrl: "https://www.youtube.com/watch?v=e9FuRpIO-Ws",
    title:
      "Saavli Official Video. http://bit.ly/SaavliiTunes & http://bit.ly/SaavliDownload",
  },
  {
    file: "Saazani by Shekhar Ravjiani And Bela Shinde _ Official Music Video _ साजनी _ ArtistAloud ( 128kbps ).mp3",
    query:
      "ArtistAloud - Saazani by Shekhar Ravjiani And Bela Shinde | Official Music Video | साजनी | ArtistAloud",
    youtubeId: "4BUH4E6iBI4",
    youtubeUrl: "https://www.youtube.com/watch?v=4BUH4E6iBI4",
    title:
      "Saazani by Shekhar Ravjiani And Bela Shinde   Official Music Video   Indipop   ArtistAloud",
  },
  {
    file: "Sadguru-Natha-Hat-Jodito-Mahesh-Hiremath-Shubhangi-Joshi.mp3",
    query:
      "Mahesh Hiremath,Shubhangi Joshi (Pendu-Jatt.Com) - Sadguru Natha Hat Jodito (PenduJatt.Com)",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Sadka Best Audio Song - I Hate Luv StorysSonam KapoorImran KhanSurajMahalaxmi Iyer.mp3",
    query:
      "Hate Luv story - Sadka Best Audio Song - I Hate Luv StorysSonam KapoorImran KhanSurajMahalaxmi Iyer",
    youtubeId: "UdE_yPU9218",
    youtubeUrl: "https://www.youtube.com/watch?v=UdE_yPU9218",
    title:
      "Sadka Best Audio Song - I Hate Luv Storys|Sonam Kapoor|Imran Khan|Suraj|Mahalaxmi Iyer",
  },
  {
    file: "Sadka I Hate Luv Storys 320 Kbps.mp3",
    query: "Vishal-Shekhar, Suraj Jagan, Mahalakshmi Iyer - Sadka - PagalNew ",
    youtubeId: "9hIgYEF42so",
    youtubeUrl: "https://www.youtube.com/watch?v=9hIgYEF42so",
    title:
      "Sadka Full Video - I Hate Luv Storys|Sonam Kapoor, Imran Khan|Suraj Jagan, Mahalaxmi Iyer",
  },
  {
    file: "Samay Samjhayega _ Tum Prem Ho Sad _ Radha Krishn _ LOFI _ MOhit lalwani _ Surya Raj Kamal.mp3",
    query:
      "Samay Samjhayega _ Tum Prem Ho Sad _ Radha Krishn _ LOFI _ MOhit lalwani _ Surya Raj Kamal",
    youtubeId: "6ZwwapPikyQ",
    youtubeUrl: "https://www.youtube.com/watch?v=6ZwwapPikyQ",
    title:
      "Samay Samjhayega Full Song | Tum Prem Ho Sad | Radha Krishn | LOFI | MOhit lalwani |Bharat Kamal",
  },
  {
    file: "Sampurna Jagala Tuzya Rupacha Rang Dila Deva __ Shinde Saajan __ संपूर्ण जगाला तुझ्या रूपाचा __ ( 128kbps ).mp3",
    query:
      "Shinde Saajan - Sampurna Jagala Tuzya Rupacha Rang Dila Deva || Shinde Saajan || संपूर्ण जगाला तुझ्या रूपाचा ||",
    youtubeId: "cgwFXlgudic",
    youtubeUrl: "https://www.youtube.com/watch?v=cgwFXlgudic",
    title:
      "|| Sampurna Jagala Tuzya Rupacha Rang Dila Deva || Shinde Saajan || संपूर्ण जगाला तुझ्या रूपाचा || ",
  },
  {
    file: "Sanedo - Made in China.mp3",
    query:
      "Mika Singh,Benny Dayal,Nikhita Gandhi (Pagalworld.name) - Sanedo (Pagalworld.name)",
    youtubeId: "bOvEge2Iu2c",
    youtubeUrl: "https://www.youtube.com/watch?v=bOvEge2Iu2c",
    title:
      "Sanedo - Made In China | Rajkummar & Mouni | Mika, Nikhita Gandhi, Benny Dayal | Sachin-Jigar | 4K",
  },
  {
    file: "Sanj Rangali Official Lyrical Song Surya JayRaj  Shubhangi Kedar  Tanmay Bhave  Yogesh Save.mp3",
    query:
      "Sanj Rangali Official Lyrical Song Surya JayRaj  Shubhangi Kedar  Tanmay Bhave  Yogesh Save",
    youtubeId: "LGXDBS7Zp5w",
    youtubeUrl: "https://www.youtube.com/watch?v=LGXDBS7Zp5w",
    title:
      "Sanj Rangali Official Lyrical Song |Surya JayRaj | Shubhangi Kedar | Tanmay Bhave | Yogesh Save | ​",
  },
  {
    file: "Sapna Jahan (Brothers) Sonu Nigam 320Kbps.mp3",
    query:
      "Ajay-Atul, Sonu Nigam , Neeti Mohan (PagalWorld.com) - Sapna Jahan (PagalWorld.com)",
    youtubeId: "lHJp_3g2MAI",
    youtubeUrl: "https://www.youtube.com/watch?v=lHJp_3g2MAI",
    title:
      "Sapna Jahan Full Video - Brothers|Akshay Kumar, Jacqueline|Sonu Nigam, Neeti Mohan",
  },
  {
    file: "Satranga (Animal)_320-(PagalWorld.Com.IN).mp3",
    query:
      " ,Arijit Singh ,-(PagalWorld.Com.IN) - Satranga (Animal)-(PagalWorld.Com.IN)",
    youtubeId: "5RegNMWsCEU",
    youtubeUrl: "https://www.youtube.com/watch?v=5RegNMWsCEU",
    title:
      "Satranga 3D and lofi music 🎼🎶  Form animal Movie #satrangalofi #satranga3D || Arijit Singh",
  },
  {
    file: "Sau Dard Jaan E Mann 320 Kbps.mp3",
    query: "Anu Malik, Sonu Nigam, Suzanne - Sau Dard - PagalNew ",
    youtubeId: "xo8JU-Vc1C0",
    youtubeUrl: "https://www.youtube.com/watch?v=xo8JU-Vc1C0",
    title:
      "Sau Dard Hai Full Song | Salman Khan | Jaan-E-Mann | Preity Zinta, Akshay Kumar | Sonu Nigam, Suzan",
  },
  {
    file: "Savali (PenduJatt.Com.Se).mp3",
    query: "Savali (PenduJatt.Com.Se)",
    youtubeId: "vZRWR_8KeQk",
    youtubeUrl: "https://www.youtube.com/watch?v=vZRWR_8KeQk",
    title:
      "Jatt Sawle (Official Video) | Ravinder Grewal | Jay K | New Punjabi Songs 2026 |Latest Punjabi Songs",
  },
  {
    file: "Savali-Unhamadhe-Swapnil-Bandodkar.mp3",
    query:
      "Swapnil Bandodkar (Pendu-Jatt.Com) - Savali Unhamadhe (PenduJatt.Com)",
    youtubeId: "b4Lx0XsNvhM",
    youtubeUrl: "https://www.youtube.com/watch?v=b4Lx0XsNvhM",
    title: "Ha Chandra Tujhyasathi Swapnil Bandodkar Song ... - PenduJatt",
  },
  {
    file: "Shekhar-Ravjianis-Hanuman-Chalisa-Shekhar-Ravjiani.mp3",
    query: "Shekhar Ravjiani - Shekhar Ravjiani's Hanuman Chalisa",
    youtubeId: "ofevZ1CACPM",
    youtubeUrl: "https://www.youtube.com/watch?v=ofevZ1CACPM",
    title:
      "Hanuman Chalisa - Shekhar Ravjiani | Video Song & Lyrics | Zee Music Devotional",
  },
  {
    file: "Shiddat - Title Song.mp3",
    query: "Manan Bhardwaj (Pagalworld.pw) - Shiddat (Pagalworld.pw)",
    youtubeId: "4YCOgIEGMnI",
    youtubeUrl: "https://www.youtube.com/watch?v=4YCOgIEGMnI",
    title: "Shiddat Title Song Track(Lyrics) -By Manan Bhardwaj",
  },
  {
    file: "Shivam - Bahubali 2 - 190Kbps.mp3",
    query: "Kaala Bhairava - PagalWorld.me - Shivam - PagalWorld.cool",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Shivba Raja - Sher Shivraj.mp3",
    query: "Avadhoot Gandhi (Pagalworld.pw) - Shivba Raja (Pagalworld.pw)",
    youtubeId: "gAzMqmenkMY",
    youtubeUrl: "https://www.youtube.com/watch?v=gAzMqmenkMY",
    title:
      "Shivba Raja | Sher Shivraj | Digpal Lanjekar | Avadhoot Gandhi | Devdutta Manisha Baji",
  },
  {
    file: "Shivrajyabhishek Geet (Hirkani)- [PagalWorld.NL].mp3",
    query:
      "Amitraj, Deepali Desai, Gaurav Chati, Jiya, Suresh Wadkar, Neelambari Kirkire, Santosh Bote, Vivek Naik | MyMp3Bhojpuri.In - Shivrajyabhishek Geet (Hirkani) - MyMp3Bhojpuri.In",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Sholay - RRR.mp3",
    query:
      "Vishal Mishra, Benny Dayal, Sahithi Chaganti (Pagalworld.pw) - Sholay (Pagalworld.pw)",
    youtubeId: "D3QtfZqv9aQ",
    youtubeUrl: "https://www.youtube.com/watch?v=D3QtfZqv9aQ",
    title:
      "Sholay - Vishal Mishra, Benny Dayal Lyrics (Hindi, English) Translation",
  },
  {
    file: "SHOORVEER-.mp3",
    query:
      "SHOORVEER - A Tribute to महाराणा प्रताप जी | Rapperiya Baalam | Rajneesh Jaipuri | Honey Trouper",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "SHOORVEER-3-A-Tribute-to-छत्रपति-शिवाजी-महाराज-Rapperiya-Baalam-Ft.-Shambho-I-Meetu-Solanki.mp3",
    query:
      "SHOORVEER 3 - A Tribute to छत्रपति शिवाजी महाराज | Rapperiya Baalam Ft. Shambho I Meetu Solanki",
    youtubeId: "DXCd7Moy3to",
    youtubeUrl: "https://www.youtube.com/watch?v=DXCd7Moy3to",
    title:
      "SHOORVEER 3 - A Tribute to छत्रपति शिवाजी महाराज | Rapperiya Baalam Ft. Shambho I Meetu Solanki",
  },
  {
    file: "Shree Hanuman Chalisa(PagalWorld.com.sb).mp3",
    query: "Gulshan Kumar - Shree Hanuman Chalisa(PagalWorld.com.se)",
    youtubeId: "17ZHT4WbSfw",
    youtubeUrl: "https://www.youtube.com/watch?v=17ZHT4WbSfw",
    title:
      "हनुमान चालीसा गीत के साथ हरिहरन के द्वारा [पूरा वीडियो गाना] | गीतात्मक वीडियो",
  },
  {
    file: "Shukran Allah - Kurbaan 320 Kbps.mp3",
    query:
      "Sonu Nigam, Salim Merchant, Salim-Sulaiman, Shreya Ghoshal - Shukran Allah",
    youtubeId: "Vq-iZG8RUFU",
    youtubeUrl: "https://www.youtube.com/watch?v=Vq-iZG8RUFU",
    title:
      "Shukran Allah Live in Mumbai | Salim Sulaiman, Sonu Nigam | GoDaddy presents Zariya | #SSLive",
  },
  {
    file: "Shut Up Bounce Dostana Original Motion Picturetrack 128 Kbps.mp3",
    query:
      "Vishal-Shekhar, Sunidhi Chauhan, Vishal Dadlani - Shut Up &amp; Bounce - PagalNew ",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Shut Up Bounce Dostana Original Motion Picturetrack 320 Kbps.mp3",
    query:
      "Vishal-Shekhar, Sunidhi Chauhan, Vishal Dadlani - Shut Up &amp; Bounce - PagalNew ",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Shwasat Raja Dhyasat Raja_192(PagalWorldl).mp3",
    query: "PagalWorldl.Com - Shwasat Raja Dhyasat Raja(PagalWorldl)",
    youtubeId: "57Mx-leFi08",
    youtubeUrl: "https://www.youtube.com/watch?v=57Mx-leFi08",
    title:
      "Shwasat Raja Dhyasat Raja Lofi Song [Slowed + reverb] Marathi Lofi Song |",
  },
  {
    file: "silver-quarter-4-44684.mp3",
    query: "silver-quarter-4-44684",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Sooraj Dooba Hain - Roy 320 Kbps.mp3",
    query: "Amaal Mallik, Arijit Singh, Aditi Singh Sharma - Sooraj Dooba Hain",
    youtubeId: "nJZcbidTutE",
    youtubeUrl: "https://www.youtube.com/watch?v=nJZcbidTutE",
    title: "सूरज डूबा हैं 'पूरा वीडियो गाना | अरिजीत सिंह | टी-सीरीज",
  },
  {
    file: "Srivalli - Pushpa.mp3",
    query: "Javed Ali (Pagalworld.pw) - Srivalli (Pagalworld.pw)",
    youtubeId: "KTki8bU8wg8",
    youtubeUrl: "https://www.youtube.com/watch?v=KTki8bU8wg8",
    title:
      "Srivalli 8K Video | Pushpa | Allu Arjun, Rashmika Mandanna | Javed Ali | DSP | Sukumar",
  },
  {
    file: "Sudarshan Desai(00917045004652)_20211023111419.mp3",
    query: "Sudarshan Desai(00917045004652)_20211023111419",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Sultan - KGF 128 Kbps.mp3",
    query:
      "Vijay Urs, Abhishek Chaithra Soman, Santhosh Venky, Chethan Naik, Deepesh, Renjith Unni - Sultan",
    youtubeId: "Ek-2VWEvQkQ",
    youtubeUrl: "https://www.youtube.com/watch?v=Ek-2VWEvQkQ",
    title:
      "Full Video Song:  Sultan | KGF | Yash | Srinidhi Shetty | Ravi Basrur | T-Series",
  },
  {
    file: "Sulthan Kgf Chapter 2 320 Kbps.mp3",
    query: "Brijesh Shandilya - Sulthan - PagalNew ",
    youtubeId: "-pwPC_90ttw",
    youtubeUrl: "https://www.youtube.com/watch?v=-pwPC_90ttw",
    title: "Sulthan",
  },
  {
    file: "Sun Raha Hai Na Tu - Reloaded by  Ankit Tiwari _ T-Series ( 128kbps ).mp3",
    query:
      "T-Series - Sun Raha Hai Na Tu - Reloaded by  Ankit Tiwari | T-Series",
    youtubeId: "2b-JOu-72F8",
    youtubeUrl: "https://www.youtube.com/watch?v=2b-JOu-72F8",
    title: "Sun Raha Hai Na Tu - Reloaded by  Ankit Tiwari | T-Series",
  },
  {
    file: "Sunya-Sunya-Maifilit-Majhya--Umbartha--Soundtrack-Version--Lata-Mangeshkar.mp3",
    query:
      "Lata Mangeshkar - Sunya Sunya Maifilit Majhya (Umbartha / Soundtrack Version)",
    youtubeId: "2uXVX0r_zRo",
    youtubeUrl: "https://www.youtube.com/watch?v=2uXVX0r_zRo",
    title:
      "सुन्या सुन्या मैफिलीत माझ्या - Lata Mangeshkar | Smita Patil | Sunya Sunya Maifilit Majhya |Umbartha",
  },
  {
    file: "Swapneehee_Navhate_Disale_SgWDBVn73Co_140.mp3",
    query: "Swapneehee Navhate Disale",
    youtubeId: "5ybN5GIuR2k",
    youtubeUrl: "https://www.youtube.com/watch?v=5ybN5GIuR2k",
    title:
      "Swapnihi Navhte Disale - Marathi Romantic Song - Rama Madhav - Latest Marathi Movie",
  },
  {
    file: "Takladu_Roop_Nagar_Ke_Cheetey_Narayani_Gopan_Karan_Kuna_qzlLwiVbkBM_140.mp3",
    query:
      "Takladu | Roop Nagar Ke Cheetey | Narayani Gopan | Karan, Kunal, Hemal, Aayushi, Shaan R, Narayani G",
    youtubeId: "qzlLwiVbkBM",
    youtubeUrl: "https://www.youtube.com/watch?v=qzlLwiVbkBM",
    title:
      "Takladu | Roop Nagar Ke Cheetey | Narayani Gopan | Karan, Kunal, Hemal, Aayushi, Shaan R, Narayani G",
  },
  {
    file: "Tera Chehra Adnan Sami 320 Kbps.mp3",
    query: "Adnan Sami - Tera Chehra - PagalNew ",
    youtubeId: "Di1TbA7MHUs",
    youtubeUrl: "https://www.youtube.com/watch?v=Di1TbA7MHUs",
    title:
      'अदनान सामी "तेरा चेहरा" पूरा वीडियो गाना एच डी  (सेड संस्करण) फ़ीट रानी मुखर्जी',
  },
  {
    file: "Tera Chehra Sad Version Adnan Sami 320 Kbps.mp3",
    query: "Adnan Sami - Tera Chehra (Sad Version) - PagalNew ",
    youtubeId: "Di1TbA7MHUs",
    youtubeUrl: "https://www.youtube.com/watch?v=Di1TbA7MHUs",
    title:
      'अदनान सामी "तेरा चेहरा" पूरा वीडियो गाना एच डी  (सेड संस्करण) फ़ीट रानी मुखर्जी',
  },
  {
    file: "Tera Chehra Sanam Teri Kasam 320 Kbps.mp3",
    query: "Arijit Singh, Himesh Reshammiya - Tera Chehra - PagalNew",
    youtubeId: "LOmC1dlZ2BE",
    youtubeUrl: "https://www.youtube.com/watch?v=LOmC1dlZ2BE",
    title:
      "Tera Chehra - Lyric Video | Arijit Singh | Himesh R | Harshvardhan, Mawra | Sanam Teri Kasam",
  },
  {
    file: "Tera Hua_Loveratri 2018 -.mp3",
    query: "Atif Aslam - Tera Hua - JioSongs.com",
    youtubeId: "MDlXAIoesQI",
    youtubeUrl: "https://www.youtube.com/watch?v=MDlXAIoesQI",
    title:
      "Pachtaoge Full Song (Lyrics) - Arijit Singh | B Praak, Jaani | Audio | New Song 2019",
  },
  {
    file: "Tere Bina  - Guru 128 Kbps.mp3",
    query:
      "A.R. Rahman, Chinmayi Sripada, Murtuza Khan, Qadir Khan - Tere Bina ",
    youtubeId: "_mwqXnTEHSc",
    youtubeUrl: "https://www.youtube.com/watch?v=_mwqXnTEHSc",
    title:
      "A.R. Rahman - Tere Bina | Lyrical Song | Aishwarya Rai | Abhishek Bachchan | Guru | Gulzar",
  },
  {
    file: "Tere Hawaale Laal Singh Chaddha 320 Kbps.mp3",
    query: "Arijit Singh, Shilpa Rao - Tere Hawaale - PagalNew",
    youtubeId: "KUpwupYj_tY",
    youtubeUrl: "https://www.youtube.com/watch?v=KUpwupYj_tY",
    title:
      "Tere Hawaale (Full Video) Laal Singh Chaddha | Aamir,Kareena | Arijit,Shilpa | Pritam,Amitabh,Advait",
  },
  {
    file: "Tere Naam - PagalSongs.com (1).mp3",
    query: "Udit Narayan, Alka Yagnik - Tere Naam - PagalSongs.com",
    youtubeId: "bH3bLzYK8Dc",
    youtubeUrl: "https://www.youtube.com/watch?v=bH3bLzYK8Dc",
    title: "TERE NAAM (SAD)",
  },
  {
    file: "Tere Naino Mein _ Nihar Dongre Choreography _ The bilz & kashif _ Gang 13 ( 128kbps ).mp3",
    query:
      "Gang13 Official - Tere Naino Mein | Nihar Dongre Choreography | The bilz & kashif | Gang 13",
    youtubeId: "mvz1iGOepjs",
    youtubeUrl: "https://www.youtube.com/watch?v=mvz1iGOepjs",
    title:
      "Tere Naino Mein | Nihar Dongre Choreography | The bilz & kashif | Gang 13",
  },
  {
    file: "Teri_Yaadon_Mein_Full_Song_The_Killer_KK_Emraan_Hashmi__f6BTPO2OAB0_140.mp3",
    query:
      "Teri Yaadon Mein | Full Song | The Killer | KK | Emraan Hashmi | High volume | High quality",
    youtubeId: "f6BTPO2OAB0",
    youtubeUrl: "https://www.youtube.com/watch?v=f6BTPO2OAB0",
    title:
      "Teri Yaadon Mein | Full Song | The Killer | KK | Emraan Hashmi | High volume | High quality",
  },
  {
    file: "The Monster Song - KGF 2.mp3",
    query: "Adithi Sagar (Pagalworld.pw) - The Monster Song (Pagalworld.pw)",
    youtubeId: "R4He_Gcn7cA",
    youtubeUrl: "https://www.youtube.com/watch?v=R4He_Gcn7cA",
    title:
      "The Monster Song - KGF Chapter 2 | Adithi Sagar | Ravi Basrur | Yash | Sanjay Dutt | Prashanth Neel",
  },
  {
    file: "The Monster Song Extended Version Kgf Chapter 2 Hindi 320 Kbps.mp3",
    query:
      "Ravi Basrur, Adithi Sagar - The Monster Song (Extended Version) - PagalNew ",
    youtubeId: "b0eoIPALte4",
    youtubeUrl: "https://www.youtube.com/watch?v=b0eoIPALte4",
    title:
      "Dheere Dheere Video Song | Hindi Version | KGF Chapter1 #song #yash  ",
  },
  {
    file: "The-Promise---Baghtos-Kay-Mujra-Kar--Title-Track--Siddharth-Mahadevan.mp3",
    query:
      "Siddharth Mahadevan - The Promise - Baghtos Kay Mujra Kar (Title Track)",
    youtubeId: "x1Bc8r_v_2s",
    youtubeUrl: "https://www.youtube.com/watch?v=x1Bc8r_v_2s",
    title:
      "Baghtos Kay Mujra Kar with Lyrics | Marathi Songs | Shivaji Maharaj Songs | Siddharth | Amitraj",
  },
  {
    file: "Ti-Talwar-Adarsh-Shinde.mp3",
    query: "Adarsh Shinde - Ti Talwar",
    youtubeId: "2ThJs0Mwce8",
    youtubeUrl: "https://www.youtube.com/watch?v=2ThJs0Mwce8",
    title:
      "Ti Talwar (Powada) ft Shreyas Talpade | Superhit Marathi Songs | Baghtos Kay Mujra Kar | Amitraj",
  },
  {
    file: "Toofan Kgf Chapter 2 320 Kbps.mp3",
    query: "Sandesh Datta Naik - Toofan - PagalNew ",
    youtubeId: "WSIUgg-SK1M",
    youtubeUrl: "https://www.youtube.com/watch?v=WSIUgg-SK1M",
    title: "KGF Chapter 2 Hindi Movie Audio Songs Jukebox | DOWNLOAD LINK",
  },
  {
    file: "Tu Aashiqui Hai Jhankaar Beats 320 Kbps.mp3",
    query: "Vishal-Shekhar, KK - Tu Aashiqui Hai - PagalNew ",
    youtubeId: "aw0s2KaoA2Q",
    youtubeUrl: "https://www.youtube.com/watch?v=aw0s2KaoA2Q",
    title:
      "Tu Aashiqui Hai Full Video - Jhankaar Beats|KK|Vishal & Shekhar| Sanjay Suri, Juhi Chawla",
  },
  {
    file: "Tu Abhaal.mp3",
    query: "Ajay-Atul, Kunal Karan - Tu Abhaal",
    youtubeId: "fbIWaMN5HSQ",
    youtubeUrl: "https://www.youtube.com/watch?v=fbIWaMN5HSQ",
    title:
      "Yek Number | Tu Abhaal (Song) | Javed A, Ravindra K | Kunal Karan | Tejaswini | Warda | Sahyadri F",
  },
  {
    file: "Tu Har Lamha (Khamoshiyan) - Arijit Singh.mp3",
    query: "Arijit Singh (PagalWorld.com) - Tu Har Lamha - PagalWorld.com",
    youtubeId: "GqR4gLsjEKc",
    youtubeUrl: "https://www.youtube.com/watch?v=GqR4gLsjEKc",
    title:
      "तू हर लम्‍हा- खामोशियां | अरिजीत सिंह | पूरे गीत का नया वीडियो, गीत के बोल के साथ",
  },
  {
    file: "Tu Jithe Mi Tithe- [PagalWorld.NL].mp3",
    query: "Swapnil Bandodkar, Neha Rajpal - Tu Jithe Mi Tithe - PagalWorld.NL",
    youtubeId: "qdivdOKT-1k",
    youtubeUrl: "https://www.youtube.com/watch?v=qdivdOKT-1k",
    title:
      "Tu Jithe Mi Tithe Song - Photocopy | New Marathi Romantic Songs 2016 | Parna Pethe, Chetan Chitnis",
  },
  {
    file: "Tu Jo Mila (Bajrangi Bhaijaan) - K.K - 320Kbps.mp3",
    query: "K.K. (PagalWorld.cool) - Tu Jo Mila - PagalWorld.cool",
    youtubeId: "9i1Ri8kPoec",
    youtubeUrl: "https://www.youtube.com/watch?v=9i1Ri8kPoec",
    title:
      "तू जो मिला 'पूरा गाना बोल के साथ - के.के. | सलमान खान, हर्षाली | बजरंगी भाईजान",
  },
  {
    file: "Tu Jo Mila Bajrangi Bhaijaan 320 Kbps.mp3",
    query: "Pritam, KK - Tu Jo Mila - PagalNew",
    youtubeId: "6DCOjq0omBc",
    youtubeUrl: "https://www.youtube.com/watch?v=6DCOjq0omBc",
    title:
      "तू जो मिला 'वीडियो गाना - के.के. | सलमान खान, नवाजुद्दीन, हर्षाली | बजरंगी भाईजान",
  },
  {
    file: "Tu Jo Mila Dekhna Na Mud Ke Bajrangi Bhaijaan 320 Kbps.mp3",
    query: "Pritam, Javed Ali - Tu Jo Mila (Dekhna Na Mud Ke) - PagalNew",
    youtubeId: "-HW_aRcnG6M",
    youtubeUrl: "https://www.youtube.com/watch?v=-HW_aRcnG6M",
    title:
      "तू जो मिला (देखना ना मुड़के) 'पूरा ऑडियो गाना | जावेद अली | बजरंगी भाईजान",
  },
  {
    file: "Tu Jo Mila Reprise Bajrangi Bhaijaan 320 Kbps.mp3",
    query: "Pritam, Papon - Tu Jo Mila (Reprise) - PagalNew",
    youtubeId: "XklgDLa9nZU",
    youtubeUrl: "https://www.youtube.com/watch?v=XklgDLa9nZU",
    title:
      "Tu Jo Mila (Lyrics) | Bajrangi Bhaijaan | Salman Khan, Kareena Kapoor, Kk, Pritam With Lyrics",
  },
  {
    file: "Tu Meri Dost Hain Yuvvraaj 320 Kbps.mp3",
    query:
      "Benny Dayal, Shreya Ghoshal, A.R. Rahman - Tu Meri Dost Hain - PagalNew ",
    youtubeId: "NWdasSZcvHY",
    youtubeUrl: "https://www.youtube.com/watch?v=NWdasSZcvHY",
    title:
      "Tu Meri Dost Hain Full Video - Yuvvraaj |Salman Khan, Katrina Kaif| Shreya Ghoshal, Benny|A.R Rahman",
  },
  {
    file: "Tu-Disate-Harshavardhan-Wavare-Kasturi-Wavare (2).mp3",
    query: "Harshavardhan Wavare - Tu Disate",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Tujhe Kitna Chahein Aur (Film Version) - Kabir Singh 320 Kbps.mp3",
    query: "Jubin Nautiyal, Mithoon - Tujhe Kitna Chahein Aur (Film Version)",
    youtubeId: "92J9p0VplTo",
    youtubeUrl: "https://www.youtube.com/watch?v=92J9p0VplTo",
    title:
      "Full Song: Tujhe Kitna Chahein Aur (Film Version) | Kabir Singh | Shahid K, Kiara A | Mithoon |Jubin",
  },
  {
    file: "Tujhe Kitna Chahne Lage - Kabir Singh 320 Kbps.mp3",
    query: "Arijit Singh, Mithoon - Tujhe Kitna Chahne Lage",
    youtubeId: "AgX2II9si7w",
    youtubeUrl: "https://www.youtube.com/watch?v=AgX2II9si7w",
    title:
      "Full Song: Tujhe Kitna Chahne Lage | Kabir Singh | Mithoon Feat. Arijit Singh | Shahid K, Kiara A",
  },
  {
    file: "Tula-Kalnnaar-Nahi-Neha-Rajpal-Swapnil-Bandodkar.mp3",
    query: "Tula-Kalnnaar-Nahi-Neha-Rajpal-Swapnil-Bandodkar",
    youtubeId: "RQ41GyL1PXQ",
    youtubeUrl: "https://www.youtube.com/watch?v=RQ41GyL1PXQ",
    title:
      "Tula Kalnnaar Nahi - Title Track | Subodh Bhave & Sonalee Kulkarni | Neha Rajpal & Swapnil Bandodkar",
  },
  {
    file: "Tula_Kalnnaar_nahi_Title_song_Neha_Rajpal_Swapnil_Bando_AhJsj5e5i0w_140.mp3",
    query:
      "Tula Kalnnaar nahi :: Title song ||Neha Rajpal & Swapnil Bandodkar|| marathi love song",
    youtubeId: "RQ41GyL1PXQ",
    youtubeUrl: "https://www.youtube.com/watch?v=RQ41GyL1PXQ",
    title:
      "Tula Kalnnaar Nahi - Title Track | Subodh Bhave & Sonalee Kulkarni | Neha Rajpal & Swapnil Bandodkar",
  },
  {
    file: "Tum gaye ho kyun raat baaki hai' but you just can't stop thinking of her while it's raining...mp3",
    query:
      "Tum gaye ho kyun raat baaki hai' but you just can't stop thinking of her while it's raining..",
    youtubeId: "hU2W_XJuvFs",
    youtubeUrl: "https://www.youtube.com/watch?v=hU2W_XJuvFs",
    title:
      "Jiyein kyun-❣️but you just can't stop thinking of her while it's raining..🌧️",
  },
  {
    file: "Tum Ko - Rockstar 320 Kbps.mp3",
    query: "Kavita Krishnamurthy - Tum Ko",
    youtubeId: "72zKTf8NoMc",
    youtubeUrl: "https://www.youtube.com/watch?v=72zKTf8NoMc",
    title: "Tum Ko",
  },
  {
    file: "Tum Kya Mile - Arijit Singh.mp3",
    query:
      "Arijit Singh , Shreya Ghoshal (Pagalworld.tv) - Tum Kya Mile (Pagalworld.tv)",
    youtubeId: "pGfpXjQokYc",
    youtubeUrl: "https://www.youtube.com/watch?v=pGfpXjQokYc",
    title:
      "Tum kya mile - Arijit Singh, Shreya Ghoshal (lyrics)| RARKPK| Alia Bhatt, Ranveer Singh | Rhythm hub",
  },
  {
    file: "Tum Mile Tum Mile Original Motion Picturetrack 320 Kbps.mp3",
    query: "Pritam, Neeraj Shridhar - Tum Mile - PagalNew ",
    youtubeId: "UcqI3uBKgTg",
    youtubeUrl: "https://www.youtube.com/watch?v=UcqI3uBKgTg",
    title:
      "Tum Mile Full Video - Title Track | Emraan Hashmi, Soha Ali | Pritam| Neeraj Shridhar | Kumaar | 4K",
  },
  {
    file: "Tum Se Hi Jab We Met 320 Kbps.mp3",
    query: "Pritam, Mohit Chauhan - Tum Se Hi - PagalNew ",
    youtubeId: "Cb6wuzOurPc",
    youtubeUrl: "https://www.youtube.com/watch?v=Cb6wuzOurPc",
    title:
      "Tum Se Hi Lyrcial | Jab We Met | Kareena Kapoor, Shahid Kapoor | Mohit Chauhan | Pritam",
  },
  {
    file: "Tum Se Hi Lyrcial  Jab We Met  Kareena Kapoor, Shahid Kapoor  Mohit Chauhan  Pritam.mp3",
    query:
      "jab we met - Tum Se Hi Lyrcial  Jab We Met  Kareena Kapoor, Shahid Kapoor  Mohit Chauhan  Pritam",
    youtubeId: "Cb6wuzOurPc",
    youtubeUrl: "https://www.youtube.com/watch?v=Cb6wuzOurPc",
    title:
      "Tum Se Hi Lyrcial | Jab We Met | Kareena Kapoor, Shahid Kapoor | Mohit Chauhan | Pritam",
  },
  {
    file: "Tum-Prem-Ho-Tum-Preet-Ho.mp3",
    query: "Mohit Lalwani (Mr-Jatt.CoM) - Tum Prem Ho Tum Preet Ho",
    youtubeId: "-HLvk3k-a7I",
    youtubeUrl: "https://www.youtube.com/watch?v=-HLvk3k-a7I",
    title:
      '"Tum Prem Ho Tum Preet Ho" beautiful ❤️ song must listen #SOULFULL #bhaktisong #bhakti',
  },
  {
    file: "Tune Jo Na Kaha - New York 320 Kbps.mp3",
    query: "Pritam, Mohit Chauhan - Tune Jo Na Kaha",
    youtubeId: "HRSxyUM5L9s",
    youtubeUrl: "https://www.youtube.com/watch?v=HRSxyUM5L9s",
    title:
      "Tune Jo Na Kaha - lyrics | New York|John Abraham | Katrina Kaif | Neil Nitin | Mohit Chauhan, Pritam",
  },
  {
    file: "Tune Jo Na Kaha.mp3",
    query: "Mohit Chauhan - Tune Jo Na Kaha - www.hotmentos.com",
    youtubeId: "TVcd1GsUIoo",
    youtubeUrl: "https://www.youtube.com/watch?v=TVcd1GsUIoo",
    title:
      "Tune Jo Na Kaha - English Translation | Mohit Chauhan, Pritam | New York",
  },
  {
    file: "Tune Mere Jana 320 Kbps.mp3",
    query: "Gajendra Verma - Tune Mere Jana",
    youtubeId: "yUu26tcUri0",
    youtubeUrl: "https://www.youtube.com/watch?v=yUu26tcUri0",
    title:
      "Gajendra Verma - Tune Mere Jaana Kabhi Nahi Jaana I Emptiness | Gajendra Verma Songs | Sonotek Music",
  },
  {
    file: "Tya Sanj Kinaryapashi _ Somesh Narvekar _ Suyash Tilak _ Poorvi Bhave _ Hrishikesh Ranade ( 128kbps ).mp3",
    query:
      "Somesh Narvekar - Tya Sanj Kinaryapashi | Somesh Narvekar | Suyash Tilak | Poorvi Bhave | Hrishikesh Ranade",
    youtubeId: "2orWouinNs8",
    youtubeUrl: "https://www.youtube.com/watch?v=2orWouinNs8",
    title:
      "Tya Sanj Kinaryapashi | Somesh Narvekar | Suyash Tilak | Poorvi Bhave | Hrishikesh Ranade",
  },
  {
    file: "Vaaroon Mirzapur 128 Kbps.mp3",
    query: "Romy - Vaaroon - PagalNew ",
    youtubeId: "0nlsenBMEr8",
    youtubeUrl: "https://www.youtube.com/watch?v=0nlsenBMEr8",
    title:
      "Vaaroon song - Anand bhaskar, romy, ginny,diwan, mirzapur ( lyrics) ",
  },
  {
    file: "Vatevari-Mogara.mp3",
    query: "Vatevari-Mogara",
    youtubeId: "twMWmXp9mu4",
    youtubeUrl: "https://www.youtube.com/watch?v=twMWmXp9mu4",
    title:
      "Vatevari Mogara | Vaishali Samant | Swapnil Bandodkar I Nilesh Moharir | Lyric Video",
  },
  {
    file: "Ve Kamleya Rocky Aur Rani Kii Prem Kahaani 320 Kbps.mp3",
    query: "Arijit Singh, Shreya Ghoshal - Ve Kamleya - PagalNew",
    youtubeId: "TjXH_P7Khhg",
    youtubeUrl: "https://www.youtube.com/watch?v=TjXH_P7Khhg",
    title: "VE KAMLEYA - ARIJIT SINGH &  SHREYA GOSHAL ( Lyrics ) | Lyrical 7",
  },
  {
    file: "Wadalwat_title_song_montage_cT6uVgHVUwM_140.mp3",
    query: "Ashok pakkti - Wadalwat title song/montage",
    youtubeId: "cT6uVgHVUwM",
    youtubeUrl: "https://www.youtube.com/watch?v=cT6uVgHVUwM",
    title: "Wadalwat title song/montage",
  },
  {
    file: "Wafa Ne Bewafai Teraa Surroor 128 Kbps.mp3",
    query:
      "Arijit Singh, Neeti Mohan, Suzanne D&#039;Mello, Himesh Reshammiya - Wafa Ne Bewafai - PagalNew",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Wake UP Wake Up It's A Brand New Day _ Micromax Wake Up Mobile Alarm _ Top Best Alarms _ ( 128kbps ).mp3",
    query:
      "KAM KI INFORMATION - Wake UP Wake Up It's A Brand New Day | Micromax Wake Up Mobile Alarm | Top Best Alarms |",
    youtubeId: "q_rMshwZYL0",
    youtubeUrl: "https://www.youtube.com/watch?v=q_rMshwZYL0",
    title:
      "AERYS Digital Alarm Clock || Table Clock for Students || Digital Temperature Table Clock|| LCD Clock",
  },
  {
    file: "Wiz Khalifa - See You Again ft. Charlie Puth [Official Video] Furious 7 Soundtrack.mp3",
    query:
      "Wiz Khalifa - See You Again ft. Charlie Puth [Official Video] Furious 7 Soundtrack",
    youtubeId: "RgKAFK5djSk",
    youtubeUrl: "https://www.youtube.com/watch?v=RgKAFK5djSk",
    title:
      "Wiz Khalifa - See You Again ft. Charlie Puth [Official Video] Furious 7 Soundtrack",
  },
  {
    file: "Y2Mate.is - Pa Pa Pagli  Sachin-Jigar  Sonu Nigam  Siddharth Randeria  Gujarati Song  Chaal Jeevi Laiye-9EaO9BHqDjc-160k-1660298845632.mp3",
    query:
      "Y2Mate.is - Pa Pa Pagli  Sachin-Jigar  Sonu Nigam  Siddharth Randeria  Gujarati Song  Chaal Jeevi Laiye-9EaO9BHqDjc-160k-1660298845632",
    youtubeId: null,
    youtubeUrl: null,
    title: null,
  },
  {
    file: "Y2Mate.is - Samay Samjhayega Sad Song  समय समझाएगा राधा कृष्णा  Radha Krishna-wrjkdnxgskQ-160k-1660305293570.mp3",
    query:
      "Y2Mate.is - Samay Samjhayega Sad Song  समय समझाएगा राधा कृष्णा  Radha Krishna-wrjkdnxgskQ-160k-1660305293570",
    youtubeId: "ZUVFKPsdjWc",
    youtubeUrl: "https://www.youtube.com/watch?v=ZUVFKPsdjWc",
    title:
      "Samay Samjayega Sad Song #RadhaKrishna _ समै समझायेगा उदास गीत राधा कृष्ण",
  },
  {
    file: "Ye Jism Hai To Kya_320(PaglaSongs).mp3",
    query: " (PaglaSongs.Com) - Ye Jism Hai To Kya(PaglaSongs)",
    youtubeId: "2ZANf3SJ-ok",
    youtubeUrl: "https://www.youtube.com/watch?v=2ZANf3SJ-ok",
    title:
      "Thoda sa pagla thoda saina  Aishwarya Rai Full video song#aishwarya #ashabhoslesongs #love#bollywood",
  },
  {
    file: "Ye Tune Kya Kiya (Once Upon A Time Mumbaai Dobara).mp3",
    query: "Javed Bashir - PagalWorld.com - Ye Tune Kya Kiya - PagalWorld.com",
    youtubeId: "4yZ-mn0u8NE",
    youtubeUrl: "https://www.youtube.com/watch?v=4yZ-mn0u8NE",
    title: "Ye Tune Kya Kiya - Javed Bashir (Lyrics) | Lyrical Bam Hindi",
  },
  {
    file: "Zara Se (Jannat) - K.K - 320Kbps.mp3",
    query: "K.K. (PagalWorld.cool) - Zara Se - PagalWorld.cool",
    youtubeId: "JigspDUOeJQ",
    youtubeUrl: "https://www.youtube.com/watch?v=JigspDUOeJQ",
    title: "Pritam ; KK - Zara Sa (Lyrics)",
  },
  {
    file: "Zinda.mp3",
    query: "Shankar-Ehsaan-Loy  - Pagalworld.com - Zinda  - Pagalworld.com",
    youtubeId: "4IIrghqiEPY",
    youtubeUrl: "https://www.youtube.com/watch?v=4IIrghqiEPY",
    title: "Zinda (Lyrics) - Shankar-Ehsaan-Loy, Shankar Mahadevan",
  },
  {
    file: "Zindagi Tere Naam Yodha 320 Kbps.mp3",
    query: "Vishal Mishra, Kaushal Kishore - Zindagi Tere Naam - PagalNew",
    youtubeId: "Kn9FJsNOaUU",
    youtubeUrl: "https://www.youtube.com/watch?v=Kn9FJsNOaUU",
    title:
      "YODHA: Zindagi Tere Naam (Song) | Sidharth Malhotra, Raashii Khanna | Vishal Mishra",
  },
  {
    file: "खुलता_कळी_खुलेना_मराठी_सिरीयल_शीर्षक_गीत_ओमप्रकश_शिंदे__wHx1sjRrBC8_140.mp3",
    query:
      "title - k खुलता कळी खुलेना | मराठी सिरीयल | शीर्षक गीत | ओमप्रकश शिंदे, मयुरी देशमुख | झी मराठी",
    youtubeId: "GZV956y4Lio",
    youtubeUrl: "https://www.youtube.com/watch?v=GZV956y4Lio",
    title:
      "खुलता कळी खुलेना | ओमप्रकाश शिंदे | मयुरी देशमुख | शीर्षक गीत | लोफाय गीत",
  },
  {
    file: "मराठी_सिनेसृष्टी_अभिमान_गीत_New_Version_Lakh_Lakh_Chand_wOV8wsOzgMY_140.mp3",
    query:
      "मराठी सिनेसृष्टी अभिमान गीत | New Version | Lakh Lakh Chanderi | AJAY-ATUL | SIDDHESH VARADKAR",
    youtubeId: "wOV8wsOzgMY",
    youtubeUrl: "https://www.youtube.com/watch?v=wOV8wsOzgMY",
    title:
      "मराठी सिनेसृष्टी अभिमान गीत | New Version | Lakh Lakh Chanderi | AJAY-ATUL | SIDDHESH VARADKAR",
  },
  {
    file: "शिवसेना_गीत_२०२०_Shivsena_song_2020_Balasaheb_Thackrey__d1Ru9Mw04zE_140.mp3",
    query:
      "शिवसेना गीत २०२० || Shivsena song 2020 || Balasaheb Thackrey - Uddhav Saheb || Shivsena-गीत ||",
    youtubeId: "d1Ru9Mw04zE",
    youtubeUrl: "https://www.youtube.com/watch?v=d1Ru9Mw04zE",
    title:
      "शिवसेना गीत २०२० || Shivsena song 2020 || Balasaheb Thackrey - Uddhav Saheb || Shivsena-गीत ||",
  },
];
// {youtubeId:""},
export const tracks = [
  {
    id: "1",
    title: "Ghan Aaj Barse",
    artist: "Swapnil Bandodkar",
    album: "Marathi Song",
    cover: "https://i.ytimg.com/vi/SMyds5pcrOk/hqdefault.jpg",
    src: "",
    language: "marathi",
    spotifyId: "26Nu5GRBUdEA0ms3CDWWzN",
    youtubeId: "SMyds5pcrOk",
  },
  {
    id: "0",
    title: "Savali Unhamadhe",
    artist: "Sagarika Music - Marathi",
    album: "",
    cover: "https://i.ytimg.com/vi/9OO-E7aVMIM/hqdefault.jpg",
    src: "",
    language: "marathi",
    spotifyId: null,
    youtubeId: "9OO-E7aVMIM",
  },

  {
    id: "2",
    title: "Kadhi Tu Song with Lyrics",
    artist: "Everest Marathi ",
    album: "",
    cover: "https://i.ytimg.com/vi/Y4TICMyl9Eg/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "",
    youtubeId: "Y4TICMyl9Eg",
  },
  {
    id: "3",
    title: "Ka Kalena का कळेना Video Song",
    artist: "Everest Marathi ",
    album: "",
    cover: "https://i.ytimg.com/vi/VQWk3VfdIxw/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "",
    youtubeId: "VQWk3VfdIxw",
  },
  {
    id: "4",
    title: "Olya Sanjveli - Premachi Goshta",
    artist: "Everest Marathi ",
    album: "",
    cover: "https://i.ytimg.com/vi/Ofopo3YlN8w/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "",
    youtubeId: "Ofopo3YlN8w",
  },
  {
    id: "5",
    title: "Chimbh Bhijalele - चिंब भिजलेले",
    artist: "Video Palace ",
    album: "",
    cover: "https://i.ytimg.com/vi/vSWQdjhLxsU/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "",
    youtubeId: "vSWQdjhLxsU",
  },
  {
    id: "6",
    title: "Saath De Tu Mala Song Video - Mumbai Pune Mumbai 2",
    artist: "Everest Marathi ",
    album: "",
    cover: "https://i.ytimg.com/vi/i0Cj7FwEDnY/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "",
    youtubeId: "i0Cj7FwEDnY",
  },

  {
    id: "2",
    title: "Baarish",
    artist: "Ash King & Shashaa Tirupati",
    album: "Half Girlfriend",
    cover: "https://i.ytimg.com/vi/BNfAf4To73c/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "4FeiicaPWhZZusS1rddYdc",
    youtubeId: "BNfAf4To73c",
  },

  {
    id: "3",
    title: "Kabhi Jo Baadal Barse",
    artist: "Arijit Singh",
    album: "Jackpot",
    cover: "https://i.ytimg.com/vi/qH1eRWlJpsY/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "5T1yqdTEpwwo8UsjriiAQK",
    youtubeId: "qH1eRWlJpsY",
  },

  {
    id: "4",
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    album: "Aashiqui 2",
    cover: "https://i.ytimg.com/vi/NUo8CKI34o4/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "56zZ48jdyY2oDXHVnwg5Di",
    youtubeId: "NUo8CKI34o4",
  },

  {
    id: "5",
    title: "Woh Baarishein",
    artist: "Arjun Kanungo",
    album: "Woh Baarishein",
    cover: "https://i.ytimg.com/vi/qxvL7fi75ks/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "3RFNUexrtXExkzTEiJ0eBh",
    youtubeId: "qxvL7fi75ks",
  },

  {
    id: "6",
    title: "Dekho Na",
    artist: "Sonu Nigam & Sunidhi Chauhan",
    album: "Fanaa",
    cover: "https://i.ytimg.com/vi/v4h5iPlxj0c/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "5q0pLxhyHvZXnYxaygt2Az",
    youtubeId: "v4h5iPlxj0c",
  },

  {
    id: "7",
    title: "Saanson Ko Saanson Mein",
    artist: "Babul Supriyo & Alka Yagnik",
    album: "Hum Tum",
    cover: "https://i.ytimg.com/vi/joqFbZy96Xk/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "6YRbDkyTzsizAWFz8kwiI7",
    youtubeId: "joqFbZy96Xk",
  },

  {
    id: "8",
    title: "Ishq Bulaava",
    artist: "Sanam Puri & Shipra Goyal",
    album: "Hasee Toh Phasee",
    cover: "https://i.ytimg.com/vi/c2gSzYLJ8sY/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "1fkjRQA8wXPPyxqYLbxuqy",
    youtubeId: "c2gSzYLJ8sY",
  },
  {
    id: "8",
    title:
      "Kadhi Kadhi | Asa Mee Ashi Tee Marathi Movie | Sachit Patil, Pallavi Subhash, Manasi Salvi | Amitraj",
    artist: " Swapnil Bandodkar, Bela Shende",
    album: "Asa Mee Ashi Tee",
    cover: "https://i.ytimg.com/vi/c2gSzYLJ8sY/hqdefault.jpg",
    src: "",
    language: "marathi",
    youtubeId: "CK7Cjj0BHjw",
  },

  {
    id: "9",
    title: "Qaafirana",
    artist: "Arijit Singh & Nikhita Gandhi",
    album: "Kedarnath",
    cover: "https://i.ytimg.com/vi/ZmcBC9-wAXM/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "7BCp5hEiiDSmXsxsXkvYff",
    youtubeId: "ZmcBC9-wAXM",
  },

  {
    id: "10",
    title: "Apna Bana Le",
    artist: "Arijit Singh",
    album: "Bhediya",
    cover: "https://i.ytimg.com/vi/ElZfdU54Cp8/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "5bQ6oDLqvw8tywmnSmwEyL",
    youtubeId: "ElZfdU54Cp8",
  },
];
