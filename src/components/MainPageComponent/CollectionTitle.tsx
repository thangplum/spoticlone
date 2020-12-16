import React from "react";

interface CollectionTitleProps {
  title: string;
  id?: string | null;
  description?: string;
}

export const CollectionTitle: React.FC<CollectionTitleProps> = ({
  title,
  id,
  description,
}) => {
  return (
    <>
      <div className="RowTitle">
        <span style={{ lineHeight: "28px" }}>
          <h1
            style={{
              fontSize: "24px",
              letterSpacing: "-0.04em",
              fontWeight: 700,
              color: "white",
            }}
          >
            {title}
          </h1>
          {description ? (
            <p
              style={{
                fontSize: "14px",
                letterSpacing: "-0.04em",
                fontWeight: 500,
                color: "white",
              }}
            >
              {description}
            </p>
          ) : null}
        </span>
        {id ? (
          <a href={`/genre/${id}`} className="seeAll">
            See all
          </a>
        ) : null}
      </div>
    </>
  );
};
