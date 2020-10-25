import React, { useState } from "react";
import styled from "styled-components";
import logo from "./img/logo_solo.png";

const Card = styled.div`
  margin-top: 50px;
  background-color: #2d4059;
  width: 80%;
  color: white;
  text-transform: capitalize;
  border-radius: 10px 10px 0px 0px;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
`;

const Top = styled.div`
  background-color: #d41717;
  min-height: 100px;
  min-height: match-content;
  border-radius: 10px 10px 10px 10px;
  padding: 20px;
`;

const Logo = styled.img`
  width: 150px;
  height: 150px;
  position: relative;
  left: -50px;
  top: -70px;
`;

const SmileyContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-content: center;
`;

const SmileyLink = styled.span`
  margin: 10px;
  font-size: 25px;
  cursor: pointer;
`;

const Smiley = ({ pearl_id, icon, num }) => {
  const [count, setCount] = useState(num);

  const add_reaction = () => {
    // TODO fetch data from flask
    setCount(count + 1);
  };
  return (
    <SmileyLink onClick={add_reaction}>
      {icon} {count}
    </SmileyLink>
  );
};

const User = styled.h4`
  text-transform: capitalize;
  margin: 15px;
  margin-left: 0px;
`;

const CommentButton = styled.button`
  background-color: #2d4059;
  margin: auto;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 20px;
  width: 200px;
  height: fit-content;
  align-self: center;
  text-transform: uppercase;
  white-space: nowrap;
  text-align: center;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const MessageInput = styled.textarea`
  margin-top: 15px;
  background-color: #2d4059;
  border: none;
  color: white;
  width: 500px;
  height: 100px;
  text-align: left;
  font-size: 20px;
  ::placeholder {
    color: white;
    font-size: 20px;
    text-align: center;
  }
  &:focus {
    outline: none;
  }
  :-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  resize: none;
`;

const Message = (props) => {
  return (
    <MessageInput maxLength={300} placeholder={"Dis nous tout"} {...props} />
  );
};

const Response = ({ parent_id, type, setOpen }) => {
  const [message, setMessage] = useState("");

  const writer = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const send_comment = () => {
    // TODO send comment
    setOpen(false);
  };

  return (
    <div
      style={{
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Message
          key="message"
          name="message"
          type="text"
          onChange={(e) => {
            writer(e);
          }}
          value={message}
        ></Message>
        <CommentButton
          onClick={send_comment}
          style={{
            backgroundColor: "#d41717",
            width: "max-content",
            borderRadius: 0,
            margin: 0,
            marginBottom: "15px",
          }}
        >
          Terminé
        </CommentButton>
      </div>
    </div>
  );
};

const Comment = ({ id, user, message }) => {
  const [open, setOpen] = useState(false);
  const [openResponse, setOpenResponse] = useState(false);

  const Container = styled.div`
    margin-top: 20px;
    padding: 20px;
    margin-left: 10px;
    border-left: 3px solid #d41717;
  `;

  const fetch_comments = () => {
    // TODO fetch comment from flask
    setOpen(!open);
  };

  return (
    <Container>
      <User>{user}</User>
      <p>{message}</p>
      <CommentButton
        style={{ fontSize: "12px", padding: "2px", width: "fit-content" }}
        onClick={fetch_comments}
      >
        {open ? "Cacher les reponses" : "Voir les reponses"}
      </CommentButton>
      <CommentButton
        style={{
          marginLeft: "15px",
          fontSize: "12px",
          padding: "2px",
          width: "fit-content",
        }}
        onClick={() => setOpenResponse(true)}
      >
        Un truc a dire ?
      </CommentButton>
      {openResponse && (
        <Response parent_id={id} type={"comment"} setOpen={setOpenResponse} />
      )}
      {
        /* TODO remove this and use requests */ open && (
          <Comment id={id} user={user} message={message} />
        )
      }
    </Container>
  );
};

const Pearl = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [openResponse, setOpenResponse] = useState(false);

  const fetch_comments = () => {
    // TODO fetch comment from flask
    setOpen(!open);
  };

  return (
    <Card>
      {/* <Logo src={logo} alt="logo" /> */}
      <Top>
        <User>Proposé par : {data.user}</User>
        {data.message}
        <SmileyContainer>
          {data?.smileys?.map((smiley, i) => (
            <Smiley
              key={i}
              pearl_id={data.pearl_id}
              icon={smiley.icon}
              num={smiley.num}
            ></Smiley>
          ))}
        </SmileyContainer>
      </Top>
      {openResponse && (
        <Response
          parent_id={data.id}
          type={"pearl"}
          setOpen={setOpenResponse}
        />
      )}
      <div style={{ display: "flex" }}>
        <CommentButton onClick={fetch_comments}>
          {open ? "Cacher les commentaires" : "Voir les commentaires"}
        </CommentButton>
        {!openResponse && (
          <CommentButton onClick={() => setOpenResponse(!openResponse)}>
            Un truc a dire ?
          </CommentButton>
        )}
      </div>
      {open &&
        data?.comments?.map((comment, i) => (
          <Comment
            key={i}
            id={comment.id}
            user={comment.user}
            message={comment.message}
          ></Comment>
        ))}
    </Card>
  );
};

export default Pearl;
