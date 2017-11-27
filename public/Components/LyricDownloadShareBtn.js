import React from 'react';

class LyricDownloadShare extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="sub-buttons">
        <a onClick={() => this.props.toggleType('lyric')}>
          <span title="显示歌词"><svg title="Title" viewBox="0 0 20 20" height="20" width="20" className="icon" style={{ verticalAlign: 'middle' }}><desc>Icon</desc><g id="icon" fill="none" fillRule="evenodd"><g id="ci" fill="#B9B9B9"><path d="M2 7.5c0-.276.229-.5.5-.5h11c.276 0 .5.232.5.5 0 .276-.229.5-.5.5h-11a.505.505 0 0 1-.5-.5zm1 3c0-.276.215-.5.498-.5h4.004c.275 0 .498.232.498.5 0 .276-.215.5-.498.5H3.498A.504.504 0 0 1 3 10.5zm0 3c0-.276.215-.5.498-.5h4.004c.275 0 .498.232.498.5 0 .276-.215.5-.498.5H3.498A.504.504 0 0 1 3 13.5zm-1 3c0-.276.233-.5.503-.5h5.994c.278 0 .503.232.503.5 0 .276-.233.5-.503.5H2.503A.507.507 0 0 1 2 16.5zm1-12c0-.276.215-.5.498-.5h4.004c.275 0 .498.232.498.5 0 .276-.215.5-.498.5H3.498A.504.504 0 0 1 3 4.5zM9.5 4c-.303 0-.5.255-.5.5s.197.5.5.5H16v11l-3.5.044c-.328 0-.5.15-.5.456 0 .308.172.5.5.5H16c.497 0 1-.5 1-1V5c0-.5-.505-1-1-1H9.5zm4.5 6.604a.601.601 0 0 0-.596-.604H9.597a.602.602 0 0 0-.597.604v2.791c0 .333.269.605.597.605h3.807a.602.602 0 0 0 .596-.605v-2.79zM10 11h3v2h-3v-2z" id="Combined-Shape"></path></g></g></svg></span>
          <span style={{ width: '25px', display: 'inline-block' }}></span>
        </a>
        <a onClick={() => this.props.toggleType('download')}>
          <span title="离线歌曲到手机"><svg title="Title" viewBox="0 0 20 20" height="20" width="20" className="icon" style={{ verticalAlign: 'middle' }}><desc>Icon</desc><g id="icon" fill="none" fillRule="evenodd"><g id="download" fill="#B9B9B9"><g id="Group-16"><path d="M12 14H1.845C1.378 14 1 14.447 1 15c0 .553.378 1 .845 1H12v-2z" id="Combined-Shape"></path><path d="M18.405 7h-4.812c-.32 0-.593.258-.593.56v8.88c0 .302.274.56.593.56h4.812c.32 0 .593-.258.593-.56V7.56c0-.302-.274-.56-.593-.56zm-.806 8.5h-3.09c-.291 0-.51-.26-.51-.561v-5.43c0-.303.219-.562.473-.509h3.054c.254-.053.472.206.472.508v5.43c0 .303-.145.562-.4.562z" id="Shape" transform="matrix(1 0 0 -1 0 24)"></path><path d="M7 10.9v-8c0-.497.449-.9 1-.9.552 0 1 .403 1 .9v8c0 .498-.448.901-1 .901-.551 0-1-.403-1-.901z" id="Fill-36"></path><path d="M12 8.298l-4 2.805L2.375 7.16a.88.88 0 0 0-1.213.197.84.84 0 0 0 .2 1.186l6.131 4.298a.884.884 0 0 0 1.013 0L12 10.39V8.299z" id="Combined-Shape"></path></g></g></g></svg></span>
        </a>
        <span style={{ width: '25px', display: 'inline-block' }}></span>
        <a onClick={() => this.props.toggleType('share')}>
          <span title="分享这首歌"><svg title="Title" viewBox="0 0 20 20" height="20" width="20" className="icon" style={{ verticalAlign: 'middle' }}><desc>Icon</desc><g id="icon" fill="none" fillRule="evenodd"><g id="share" fill="#B9B9B9"><path d="M12.69 13.145L7.94 10.31A2.06 2.06 0 0 0 8 9.83a2.06 2.06 0 0 0-.06-.478l4.7-2.81a1.96 1.96 0 0 0 1.36.553c1.103 0 2-.918 2-2.048S15.103 3 14 3s-2 .918-2 2.048c0 .164.023.324.06.478l-4.7 2.81A1.96 1.96 0 0 0 6 7.783c-1.103 0-2 .918-2 2.048s.897 2.048 2 2.048a1.96 1.96 0 0 0 1.36-.553l4.75 2.837a1.977 1.977 0 0 0-.053.447c0 1.099.87 1.99 1.943 1.99s1.943-.891 1.943-1.99c0-1.1-.87-1.99-1.943-1.99a1.91 1.91 0 0 0-1.31.525z" id="Shape-3"></path></g></g></svg></span>
        </a>
      </div>
    )
  }
}
export default LyricDownloadShare;
