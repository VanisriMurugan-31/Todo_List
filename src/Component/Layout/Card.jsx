import React from "react";
import { Button, Card, Checkbox } from "antd";

export default function CardInfo({ title, description, image,completed, onToggle, onDelete }) {
  return (
    <Card
      hoverable
      cover={
        <img
          alt={title}
          src={image}
          style={{ height: "150px", objectFit: "cover" }}
        />
      }
      style={{ width: 250 }}
    >
      <Card.Meta title={title} description={description} />
      <Checkbox checked={completed} onChange={onToggle} style={{ marginTop: "10px" }}>
        Completed
      </Checkbox>
      <Button type="primary"  onClick={onDelete} style={{ marginTop: "10px" }} danger>
        Delete
      </Button>
    </Card>
  );
}
