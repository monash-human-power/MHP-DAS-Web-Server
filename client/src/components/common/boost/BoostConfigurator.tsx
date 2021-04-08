import React, { createRef, useState } from 'react';
import {
  faFileUpload,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from 'components/common/FontAwesomeIcon';
import { Accordion, Button, Card, Modal } from 'react-bootstrap';
import {
  BoostConfig,
  FileConfigT,
  ConfigT,
  fileConfigTypeToRuntype,
  ConfigNameT,
} from 'types/boost';
import { camelCaseToStartCase } from 'utils/string';
import BoostConfigList from 'components/common/boost/BoostConfigList';
import { Runtype } from 'runtypes';

export interface BoostConfiguratorProps {
  configs: BoostConfig[];
  onSelectConfig: (configType: ConfigT, configName: ConfigNameT) => void;
  onDeleteConfig: (configType: ConfigT, name: string) => void;
  onUploadConfig: (
    configType: FileConfigT | 'bundle',
    configFile: File,
    shape: Runtype,
    dispErr: (msg: string) => void,
  ) => void;
}

/**
 * TODO: Add real docs for this component
 *
 * @param props Props
 * @returns Component
 */
export default function BoostConfigurator({
  configs,
  onSelectConfig,
  onDeleteConfig,
  onUploadConfig,
}: BoostConfiguratorProps) {
  const fileInput = createRef<HTMLInputElement>();
  const [configType, setConfigType] = useState<FileConfigT>('bundle');

  const [confirmDeletion, setConfirmDeletion] = useState({
    show: false,
    configName: '',
    configType: 'rider',
  });

  const [displayMessage, setDisplayMessage] = useState('');
  const [showUploadErr, setShowUploadErr] = useState(false);

  const handleErrorClose = () => setShowUploadErr(false);
  const handleConfirmDialogClose = () =>
    setConfirmDeletion({ ...confirmDeletion, show: false });

  // Function to click the hidden file input button (this is a work around to avoid the ugly
  // UI of the default input file button)
  const handleClickUpload = (type: FileConfigT) => {
    if (fileInput.current) {
      setConfigType(type);
      fileInput.current.click();
    }
  };

  // Check if a file with the same given name exists
  const fileExist = (name: string) => {
    let found = false;
    configs.forEach((config) => {
      config.options.forEach((configName) => {
        if (configName.fileName === name) {
          found = true;
        }
      });
    });
    return found;
  };

  // This method gets called even if the user uploads a file and the second time they cancel
  // to upload, hence the need to check that the files attribute is not an array of 0 length
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null && event.target.files.length !== 0) {
      const dispErr = (message: string) => {
        setDisplayMessage(message);
        setShowUploadErr(true);
      };
      if (fileExist(event.target.files[0].name)) {
        dispErr(
          'A file of the same name already exists, please change the name and re-upload',
        );
      } else {
        onUploadConfig(
          configType,
          event.target.files[0],
          fileConfigTypeToRuntype[configType],
          dispErr,
        );
      }
    }
  };

  const handleDelete = () => {
    onDeleteConfig(
      confirmDeletion.configType as ConfigT,
      confirmDeletion.configName,
    );
    handleConfirmDialogClose();
  };

  return (
    <>
      <Modal show={confirmDeletion.show} onHide={handleConfirmDialogClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b className="mx-3"> Confirm Deletion</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {confirmDeletion.configName}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmDialogClose}>
            No
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showUploadErr} onHide={handleErrorClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <b className="mx-3">Upload Failed</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{displayMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleErrorClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Card style={{ marginTop: '2.5rem' }}>
        <Card.Body>
          <Card.Title style={{ marginBottom: '1.5rem' }}>
            Configuration
            <Button
              variant="outline-primary"
              className="float-right"
              onClick={() => handleClickUpload('bundle')}
            >
              Upload All Configs
            </Button>
          </Card.Title>
          <>
            <input
              ref={fileInput}
              onChange={handleFileUpload}
              type="file"
              style={{ display: 'none' }}
              accept=".json"
              multiple={false}
            />
          </>
          <Accordion>
            {configs.map((config, index) => (
              <Card>
                <Accordion.Toggle
                  as={Card.Header}
                  variant="link"
                  eventKey={String(index)}
                >
                  {camelCaseToStartCase(config.type)}
                  {': '}
                  <i>
                    {config.active ? `"${config.active.displayName}"` : 'None'}
                  </i>
                  <Button
                    variant="outline-primary"
                    className="float-right mb-1"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickUpload(config.type);
                    }}
                  >
                    <FontAwesomeIcon icon={faFileUpload} />
                  </Button>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={String(index)}>
                  <Card.Body>
                    <BoostConfigList
                      config={config}
                      onSelectConfig={(configName) =>
                        onSelectConfig(config.type, configName)
                      }
                      onDeleteConfig={(name) =>
                        setConfirmDeletion({
                          show: true,
                          configName: name,
                          configType: config.type,
                        })
                      }
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
          </Accordion>
        </Card.Body>
      </Card>
    </>
  );
}
