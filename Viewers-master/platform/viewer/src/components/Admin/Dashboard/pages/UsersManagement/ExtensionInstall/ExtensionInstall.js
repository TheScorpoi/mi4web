import React from 'react';
import './ExtensionInstall.css';
import PowerIcon from '@material-ui/icons/Power';
import PowerOffIcon from '@material-ui/icons/PowerOff';


function ExtensionInstall() {
  // const [icon, setIcon] = useState('PowerOffIcon')

  // let changeIcon = function(icon) {
  //   <PowerIcon fontSize="large" style={{ color: '#228B22' }}/>
  // }
  return (
    <div>
      <span className="titleDashboard">Extension Installation</span>
      <div className="dashExt">
        <div className="dashItemExt">
          <div className="part1">
            <span className="dashTitleExt">Extension</span>
            <div className="dashInstancesContainerExt">
              <span className="dashInstancesExt">Volume Rendering</span>
            </div>
          </div>
          <div className="dashIconsExt">
            <PowerIcon fontSize="large" style={{ color: '#228B22' }}/>
          </div>
        </div>

        <div className="dashItemExt">
          <div className="part1">
            <span className="dashTitleExt">Extension</span>
            <div className="dashInstancesContainerExt">
              <span className="dashInstancesExt">MPR</span>
            </div>
          </div>
          <div className="dashIconsExt">
          <PowerOffIcon fontSize="large" style={{ color: '#D2042D' }}/>
            
          </div>
        </div>
        <div className="dashItemExt">
          <div className="part1">
            <span className="dashTitleExt">Extension</span>
            <div className="dashInstancesContainerExt">
              <span className="dashInstancesExt">Cornerstone</span>
            </div>
          </div>
          <div className="dashIconsExt">
          <PowerOffIcon fontSize="large" style={{ color: '#D2042D' }}/>
            
          </div>
        </div>
        <div className="dashItem">
          <div className="part1">
            <span className="dashTitle">Extension</span>
            <div className="dashInstancesContainer">
              <span className="dashInstances">Dicom-pdf</span>
            </div>
          </div>
          <div className="dashIcons">
            <PowerIcon fontSize="large" style={{ color: '#228B22' }}/>
          </div>
        </div>
      </div>
      <div className="dashExt">
        <div className="dashItemExt">
          <div className="part1">
            <span className="dashTitleExt">Extension</span>
            <div className="dashInstancesContainerExt">
              <span className="dashInstancesExt">Dicom-segmentation</span>
            </div>
          </div>
          <div className="dashIconsExt">
            <PowerIcon fontSize="large" style={{ color: '#228B22' }}/>
          </div>
        </div>

        <div className="dashItemExt">
          <div className="part1">
            <span className="dashTitleExt">Extension</span>
            <div className="dashInstancesContainerExt">
              <span className="dashInstancesExt">Dicom-rt</span>
            </div>
          </div>
          <div className="dashIconsExt">
          <PowerOffIcon fontSize="large" style={{ color: '#D2042D' }}/>
            
          </div>
        </div>
        <div className="dashItemExt">
          <div className="part1">
            <span className="dashTitleExt">Extension</span>
            <div className="dashInstancesContainerExt">
              <span className="dashInstancesExt">Dicom-microscopy</span>
            </div>
          </div>
          <div className="dashIconsExt">
          <PowerOffIcon fontSize="large" style={{ color: '#D2042D' }} />
            
          </div>
        </div>
        <div className="dashItem">
          <div className="part1">
            <span className="dashTitle">Extension</span>
            <div className="dashInstancesContainer">
              <span className="dashInstances">Lesion-tracker</span>
            </div>
          </div>
          <div className="dashIcons">
            <PowerIcon fontSize="large" style={{ color: '#228B22' }} />
          </div>
        </div>
      </div>    
    </div>
  );
}

export default ExtensionInstall;
