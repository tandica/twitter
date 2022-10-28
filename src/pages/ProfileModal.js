import React from "react";
import { Alert, Figure, Form, Modal, Row } from "react-bootstrap";
import { useAuthUser } from "../context/auth-context";
import { updateUserDetails } from "../utils/api-client";
import { validate } from "../utils/validate";

export default function ProfileModal() {
  const authUser = useAuthUser();
  const url = authUser?.entities.url.urls[0]?.url;
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [banner, setBanner] = React.useState(authUser?.profile_banner);
  const [name, setName] = React.useState(authUser?.name);
  const [bio, setBio] = React.useState(authUser?.description);
  const [location, setLocation] = React.useState(authUser?.location);
  const [website, setWebsite] = React.useState(url);
  const [profile, setProfile] = React.useState(
    authUser?.profile_image_url_https
  );

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      setLoading(true);
      setError(null);
      const _name = validate(name, "name", { identifier: "Name" });
      const _bio = validate(bio, "html", {
        identifier: "Bio",
        max_length: 280,
      });
      const _website = validate(website, "html", {
        identifier: "Website URL",
        min_length: 0,
      });
      const _location = validate(location, "location", {
        identifier: "Location",
      });

      const user = {
        name: _name,
        description: _bio,
        profile_banner: banner,
        location: _location,
        website: _website,
        profile_image_url_https: profile,
      };
      await updateUserDetails(user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      enforceFocus={false}
      className="p-0"
      size="lg"
      scrollable
      show
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="py-2">
        <Modal.Title>
          <small className="font-weight-bold">
            {!"redirected" ? "Edit profile" : "Complete your profile"}
          </small>
        </Modal.Title>
      </Modal.Header>
      {error && (
        <Alert variant="danger" className="mb-0 font-weight-bold text-white">
          {error}
        </Alert>
      )}
      <Modal.Body className="pt-1 pb-0 px-0">
        <fieldset>
          <Form onSubmit={handleSubmit} noValidate>
            <Figure
              className="d-flex"
              style={{
                height: "200px",
                width: "100%",
                backgroundImage: `url(${banner})`,
              }}
            >
              {authUser?.profile_banner_url && (
                <Figure.Image
                  src={authUser?.profile_banner_url}
                  className="w-100 h-100"
                />
              )}
              <label
                htmlFor="cover-image"
                className="mx-auto my-auto btn btn-outline border px-2 py-1 font-weight-bold"
              >
                Edit cover image
              </label>
              <input
                style={{ display: "none" }}
                id="cover-image"
                type="file"
                accept="img/*"
              />
            </Figure>
            <div className="px-3">
              <Row className="d-flex justify-content-between mt-n2 px-2 align-items-center w-100">
                <label htmlFor="profile-image">
                  <Figure
                    style={{ height: "100px", width: "100px" }}
                    className="mt-n5 rounded-circle overflow-hidden bg-primary"
                  >
                    <Figure.Image className="w-100 h-100" src={profile} />
                  </Figure>
                  <input
                    style={{ display: "none" }}
                    id="profile-image"
                    type="file"
                    accept="img/*"
                  />
                </label>
              </Row>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  style={{ fontSize: "1.25rem" }}
                  type="text"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                />
              </Form.Group>
              <Form.Group controlId="bio">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  style={{ fontSize: "1.25rem", minHeight: "100px" }}
                  onChange={(event) => setBio(event.target.value)}
                  value={bio}
                />
              </Form.Group>
              <Form.Group controlId="location">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  style={{ fontSize: "1.25rem" }}
                  type="text"
                  onChange={(event) => setLocation(event.target.value)}
                  value={location}
                />
              </Form.Group>
              <Form.Group controlId="website">
                <Form.Label>Website</Form.Label>
                <Form.Control
                  style={{ fontSize: "1.25rem" }}
                  type="text"
                  onChange={(event) => setWebsite(event.target.value)}
                  value={website}
                />
              </Form.Group>
            </div>
            <Modal.Footer className="py-1">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div />
                <div className="right">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-3 py-1 font-weight-bold"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Modal.Footer>
          </Form>
        </fieldset>
      </Modal.Body>
    </Modal>
  );
}
