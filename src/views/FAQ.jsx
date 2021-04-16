import { Typography } from "@material-ui/core";
import React from "react";

const FAQView = () => {
  return (
    <React.Fragment>
      <Typography variant="subtitle2">How is URL score calculated?</Typography>
      <Typography variant="body1" noWrap={false}>{`
      a) Variables

      SEQ[UJ, TL] = Pair sequence representing amount of (Unique Jobs) yielded per crawl in relation with (Total Links) extracted
      
      b) Boundaries
      Min score =  0 
      Max score = 10
      
      
      
      c) The math
      
      # Calcualte percentage of good links that yielded a job
      fPC(UJ,TL) = UJ/TL*100 
      
      # Example
      # Seq( A[32,48], B[20,20], D[32,50])
      
      PCa = fPC(SeqA) = 66,66%
      PCb = fPC(SeqB) = 100%
      PCc = fPC(SeqC) = 64%
      
      # Average down percentages
      AvgPC = (PCa + PCb + PCc) / 3 = 76,88&
      
      
      # Narrow down to decimal scores
      SCORE = AvgPC / Max score = 7.7
      `}</Typography>
      <img
        style={{ width: 320, height: "auto" }}
        src="https://media.makeameme.org/created/what-the-faq-lj9cpd.jpg"
      />
    </React.Fragment>
  );
};

export default FAQView;
