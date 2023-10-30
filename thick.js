const appId = "60a51c906bcde01fc75a3ad0";
const NEA_CREATE_TOOLSET_ID = "64be80de738efff96cc27edd";

const chordScaleBucketsInEb = {
  tonic: {
    scoreId: "64c0993a9638a82f130dc549",
    sharingKey:
      "bd6ef69e50c7822c1f2fc5b262c553b048cf1f60add3ee9cdb1e85536b8f0d18de20b69fe6089b40e4910ba68d762c4218f00410d5d07368f021ae7298fb99c7",
  },
  subdominant: {
    scoreId: "64c099d94d7650a3d9ba7598",
    sharingKey:
      "19663d1b0e19b5f9ff11ad28b80c45546693499c94ed5d7c992bdeb9f7c58e968a219144a3aabaa05845947089607d51d25a37fe94a3ca6fcf14e67cff361c3d",
  },
  dominant: {
    scoreId: "64c09a22168dab0ff8733c35",
    sharingKey:
      "adaf25a2ea6be22b81af0658dbff5d0537625d171f9c2fed3406c6ad39a24c3ffaf87cfc662672f5aa11d0d8d9f09989567bde6c8d028586b11873d7596030c0",
  },
};





// chordScale is: 'tonic', 'subdominant', or 'domininat', 
// and a keyObj.repr: like 'C' or 'Eb'
// keyObj is like: {
//   "repr": "Bb",
//   "keyAsJSON": {
//     "fifths": "-2"
//   },
//   "clef": {
//     "sign": "C",
//     "line": "3"
//   },
//   "minOctave": 3
// }
function getChordScaleInKey(chordScale, keyObj) {
  
  const tonicBucketIntervals = [ // musical facts.
    { name: "1", offset: 0 }, // Unison
    { name: "2", offset: 2 }, // Major 2nd
    { name: "3", offset: 4 }, // Major 3rd
    { name: "5", offset: 7 }, // Perfect 5th
    { name: "6", offset: 9 }, // Major 6th
  ];

  const subdominantBucketIntervals = [
    { name: "1", offset: 0 }, // Unison
    { name: "2", offset: 2 }, // Major 2nd
    { name: "4", offset: 5 }, // Perfect 4th
    { name: "5", offset: 7 }, // Perfect 5th
    { name: "6", offset: 9 }, // Major 6th
  ];

  const dominantBucketIntervals = [
    { name: "2", offset: 2 }, // Major 2nd
    { name: "4", offset: 5 }, // Perfect 4th
    { name: "5", offset: 7 }, // Perfect 5th
    { name: "6", offset: 9 }, // Major 6th
    { name: "7", offset: 11 }, // 7th
  ];

  const chordScaleIntervals = {
    tonic: tonicBucketIntervals,
    subdominant: subdominantBucketIntervals,
    dominant: dominantBucketIntervals,
  };

  const noteToScaleIdx = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
    Cb: 11,
  };
  
  const chromaticScale = [
    {
      sharp: {
        step: "C",
        alter: "",
      },
      flat: {
        step: "C",
        alter: "",
      },
    },
    {
      sharp: {
        repr: "C#",
        alter: "1",
        step: "C",
      },
      flat: {
        repr: "Db",
        alter: "-1",
        step: "D",
      },
    },
    {
      sharp: {
        repr: "D",
        alter: "",
        step: "D",
      },
      flat: {
        repr: "D",
        alter: "",
        step: "D",
      },
    },
    {
      sharp: {
        repr: "D#",
        alter: "1",
        step: "D",
      },
      flat: {
        repr: "Eb",
        alter: "-1",
        step: "E",
      },
    },
    {
      sharp: {
        repr: "E",
        alter: "",
        step: "E",
      },
      flat: {
        repr: "E",
        alter: "",
        step: "E",
      },
    },
    {
      sharp: {
        repr: "F",
        alter: "",
        step: "F",
      },
      flat: {
        repr: "F",
        alter: "",
        step: "F",
      },
    },
    {
      sharp: {
        repr: "F#",
        alter: "1",
        step: "F",
      },
      flat: {
        repr: "Gb",
        alter: "-1",
        step: "G",
      },
    },
    {
      sharp: {
        repr: "G",
        alter: "",
        step: "G",
      },
      flat: {
        repr: "G",
        alter: "",
        step: "G",
      },
    },
    {
      sharp: {
        repr: "G#",
        alter: "1",
        step: "G",
      },
      flat: {
        repr: "Ab",
        alter: "-1",
        step: "A",
      },
    },
    {
      sharp: {
        repr: "A",
        alter: "",
        step: "A",
      },
      flat: {
        repr: "A",
        alter: "",
        step: "A",
      },
    },
    {
      sharp: {
        repr: "A#",
        alter: "1",
        step: "A",
      },
      flat: {
        repr: "Bb",
        alter: "-1",
        step: "B",
      },
    },
    {
      sharp: {
        repr: "B",
        alter: "",
        step: "B",
      },
      flat: {
        repr: "Cb",
        alter: "-1",
        step: "C",
      },
    },
  ];

  const key = keyObj.repr;
  let alter = "sharp";
  if (key.includes("b") || key === "F") { // musician said so (that F is also flat, and that all else are sharp)
    alter = "flat";
  }
  const firstPitchIdx = noteToScaleIdx[key];
  const firstPitchObj = chromaticScale[firstPitchIdx];
  let octave = keyObj.minOctave;
  
  // start from the pitch that represents the key of the score and find the 5 pitches with the corresponsing relationship from the chordScaleIntervals
  const mapped = chordScaleIntervals[chordScale].map((interval) => {
    if ( // if we reach the end of the array, go back to the front (circular array essentially) and increment octave
      Math.floor((firstPitchIdx + interval.offset) / chromaticScale.length) > 0
      ) {
      octave = keyObj.minOctave + 1;
    }

    const result =
    chromaticScale[(firstPitchIdx + interval.offset) % chromaticScale.length][
        alter
      ];
    result.octave = "" + octave;
    return result;
  });
  return mapped;
}


function keyFromScoreJSON (pieceScoreJSON) {

  const nonNegative = ["C", "G", "D", "A", "E", "B", "F#", "C#"]; // moved from global scope.
  const negatives = {
    "-1": "F",
    "-2": "Bb",
    "-3": "Eb",
    "-4": "Ab",
    "-5": "Db",
    "-6": "Gb",
    "-7": "Cb",
  };
  const CIRCLE_OF_FIFTHS = Object.assign({}, nonNegative, negatives);

  const minOctave = pieceScoreJSON["score-partwise"]["part"][0].measure.reduce( // Gets the min octave within all the measures.
    (measureMinOctave, measure) => {
      const minForMeasure = measure.note.reduce((noteMinOctave, note) => { // Gets the min octave within a measure.
        const thisOctave = parseInt(note.pitch.octave, 10);
        if (thisOctave < noteMinOctave) {
          return thisOctave;
        }
        return noteMinOctave;
      }, 100)

      if (minForMeasure < measureMinOctave) {
        return minForMeasure
      }
      return measureMinOctave
    }, 100
  ); //TODO: what if octave can be higher than 10?
  
  const keySignature = {
    repr: CIRCLE_OF_FIFTHS[
      pieceScoreJSON["score-partwise"]["part"][0]["measure"][0][
        "attributes"
      ][0]["key"]["fifths"]
    ],
    keyAsJSON:
      pieceScoreJSON["score-partwise"]["part"][0]["measure"][0][
        "attributes"
      ][0]["key"],
    clef: pieceScoreJSON["score-partwise"]["part"][0]["measure"][0]
      .attributes[0].clef,
    minOctave,
  };
  return keySignature;
};

const embedTransposed = (
  bucket,
  embed,
  templt,
  keySig,
  instrName,
  octaveShift
) => {
  const template = JSON.parse(JSON.stringify(templt));
  // const template = templt
  // change the notes in the score from whatever they are in tonic and eb to what we're given
  const scorePart =
    template?.["score-partwise"]?.["part-list"]?.["score-part"]?.[0];
  scorePart["part-name"] = instrName; //embed.instrumentName;
  scorePart["part-abbreviation"] = instrName; //embed.instrumentAbbreviation;
  scorePart["score-instrument"]["instrument-name"] = instrName; //embed.instrumentName;
  // console.log("bucket", bucket); //FIXME????

  // // change the notes from tonic eb to whatever
  // template?.["score-partwise"]?.part?.[0]?.measure?.[0]?.note?.forEach(
  //   (note, i) => {
  //     note.pitch.step = bucket[i].step;
  //     note.pitch.octave = bucket[i].octave;
  //     if (bucket[i].alter) {
  //       note.pitch.alter = bucket[i].alter;
  //     } else if (note.pitch.alter) {
  //       delete note.pitch.alter;
  //     }
  //     console.log('note.pitch', note.pitch)
  //   }
  // );

  // start from bucket, create the notes, add them to measure
  template["score-partwise"].part[0].measure[0].note = bucket.map(
    ({ alter, octave, step }) => {
      // console.log('\n\n\n\nmake note')
      // console.log('alter, octave, step' );
      // console.log(alter, octave, step );
      // const  = noteInfo
      const note = {
        staff: "1",
        voice: "1",
        duration: "1",
        pitch: { octave, step },
        type: "quarter",
      };
      if (alter !== ''){
        note.pitch.alter = alter
      }
      return note
    }
  );
  // console.log('\n\n\n\n\ntemplate["score-partwise"].part[0].measure[0].note');
  // console.log(template["score-partwise"].part[0].measure[0].note);

  // change the key signature in the score from whatever it is in tonic and eb to what we're given
  template?.["score-partwise"]?.part?.[0]?.measure?.[0]?.attributes?.forEach(
    (element) => {
      if (element.key) {
        //FIXME
        element.key.fifths = keySig.keyAsJSON.fifths;
      }
      if (element.clef) {
        //FIXME
        element.clef = keySig.clef;
      }
    }
  );

  if (octaveShift !== 0) {
    template?.["score-partwise"]?.part?.[0]?.measure?.[0]?.attributes?.forEach(
      (element) => {
        element.transpose = {
          chromatic: "0",
          "octave-change": `${octaveShift}`,
        };
      }
    );
  }

  const resultTransposed = embed.ready().then(() => {
    return embed.loadJSON(template);
  });
  return resultTransposed;
};

const bucketToString = (bucket) => {
  let alter = "";
  return bucket
    .map((note) => {
      if (note.alter) {
        alter = note.alter == -1 ? `♭` : "♯";
      } else {
        alter = "";
      }
      return note.step + alter + note.octave;
    })
    .join(" ");
};

// 
async function refToChordScaleBuckets(refEmbed, //this is the Flat embed object (from the Flat constructor) for the melody score for some song that has already been determined to be for the current student
  tonicEmbed, // this is a reference to the Flat object (result of a Flat constructor call) which already knows about its corresponding DOM element
  subdominantEmbed, 
  dominantEmbed,
  scaleDegreeElems, // this is a reference to a collection of DOM elements into which the function should put the text version of the pitches that it will ask flat io to plot for each chord scale
  instrName, // this is a reference to a given instrumen name
  octaveShift = 0) { // supposed to be for the 8va or 8vb thing (where like piccolo actually needs a higher octave even though the notes are down on the staff)

    await refEmbed.ready() 
    const pieceScoreJSON = await refEmbed.getJSON(); //from the reference song already in the correct transposition, but containing the notes of the melody rather than the chord scale bucket notes

    // console.log("refEmbed", pieceScoreJSON);
    const keySignature = keyFromScoreJSON(pieceScoreJSON); //this is a cheat code: i check the metadata of THIS STUDENT (already accounting for their instrument and the piece's composition key) as a letter like F, Bb, etc.
    
    const tonicBucket = getChordScaleInKey("tonic", keySignature); // get the 5 pitches that are in the tonic chord scale bucket for a score with the given key signature 
    scaleDegreeElems.tonic.innerHTML = `<output>${bucketToString(
      tonicBucket
    )}</output`;

    const subdominantBucket = getChordScaleInKey("subdominant", keySignature);
    scaleDegreeElems.subdominant.innerHTML = `<output>${bucketToString(
      subdominantBucket
    )}</output`;

    const dominantBucket = getChordScaleInKey("dominant", keySignature);
    scaleDegreeElems.dominant.innerHTML = `<output>${bucketToString(
      dominantBucket
    )}</output`;

    const FLAT_IO_BASIC_SCORE_JSON_TEMPLATE = {
      "score-partwise": {
        "part-list": {
          "score-part": [
            {
              "part-name": "",
              "voiceMapping": { "0": [0] },
              "staffMapping": [
                {
                  "mainVoiceIdx": 0,
                  "voices": [0],
                  "staffUuid": "staffUuid"
                }
              ],
              "voiceIdxToUuidMapping": {
                "0": "voiceUuid"
              },
              "voiceUuidToIdxMapping": {
                "voiceUuid": 0
              },
              "part-abbreviation": "",
              "score-instrument": {
                "instrument-name": "",
                "$id": "P1-I1"
              },

              "$id": "P1",
              "uuid": "P1"
            }
          ]
        },
        "part": [
          {
            "measure": [
              {
                "note": [],
                "$number": "1",
                "barline": {
                  "bar-style": "light-heavy",
                  "noteBefore": 4
                },
                "attributes": [
                  {
                    "time": { "beats": "5", "beat-type": "4" },
                    "clef": { },
                    "key": {  },
                    "staff-details": { "staff-lines": "5" }
                  }
                ]
              }
            ],
            "$id": "P1",
            "uuid": "P1"
          }
        ]
      }
    }

    // JSON representation exported from a flatio embed obj that is rendering the 5 notes for the tonic chord scale in the correct key
    const tonicChordScalePitchesFlatScoreJSON = await embedTransposed(
      tonicBucket,
      tonicEmbed,
      FLAT_IO_BASIC_SCORE_JSON_TEMPLATE,
      keySignature,
      instrName,
      octaveShift
    );
    const subdominantChordScalePitchesFlatScoreJSON = await embedTransposed (
      subdominantBucket,
      subdominantEmbed,
      FLAT_IO_BASIC_SCORE_JSON_TEMPLATE,
      keySignature,
      instrName,
      octaveShift
    );
    const dominantChordScalePitchesFlatScoreJSON = await embedTransposed (
      dominantBucket,
      dominantEmbed,
      FLAT_IO_BASIC_SCORE_JSON_TEMPLATE,
      keySignature,
      instrName,
      octaveShift
    );
    
  return {
    tonic: tonicChordScalePitchesFlatScoreJSON, 
    subdominant:  subdominantChordScalePitchesFlatScoreJSON, 
    dominant:  dominantChordScalePitchesFlatScoreJSON
  }
}

const pitchesToRests = (pieceScoreJSON) => {
  const getMeasureTimeSignature = (measure, current) => {
    let duration = 8; //default to 8 because i reasoned it might be a quarter in some cases
    let maxRests = 4; //bc 4 is a common denominator for musicians
    let updated = false;
    if (measure.attributes) {
      measure.attributes.forEach((attribute) => {
        if (attribute.divisions) {
          duration = attribute.divisions;
          updated = true;
        }
        if (attribute.time) {
          if (attribute.time.beats) {
            maxRests = attribute.time.beats;
            updated = true;
          }
        }
      });
    }
    if (updated) {
      return { duration, maxRests };
    }
    return current;
  };
  const composeScoreJSON = pieceScoreJSON;
  // nathan!
  let duration = 8; //default to 8 becasue i reasoned it might be a quarter in some cases
  let maxRests = 4; //bc 4 is a common denominator for musicians

  let currentTimeSig = {
    duration,
    maxRests,
  };
  // if (composeScoreJSON["score-partwise"].part[0].measure[0]) {
  //   const firstMeasure = composeScoreJSON["score-partwise"].part[0].measure[0];

  // }
  composeScoreJSON["score-partwise"].part[0].measure.forEach((measure) => {
    currentTimeSig = getMeasureTimeSignature(measure, currentTimeSig); //FIXME: this overwrites later measures with the default
    if (measure.direction) {
      measure.direction.forEach((directionObj) => {
        if (directionObj["direction-type"]) {
          directionObj["direction-type"] = undefined;
        }
        if (directionObj.sound) {
          directionObj.sound = undefined;
        }
      });
    }

    const bucketColors = ["#E75B5C", "#265C5C", "#4390E2"];

    // measure.note = Array(currentTimeSig.maxRests).fill({rest: {}, duration:currentTimeSig.duration})
    measure.note = Array.from({ length: currentTimeSig.maxRests }, (i, j) => {
      return {
        rest: {},
        duration: currentTimeSig.duration.toString(),
        "$adagio-location": {
          timePos: j * duration,
        },
      };
    });
  });
  // console.log("composeScoreJSON", composeScoreJSON);
  return composeScoreJSON;
};
