import { Component } from 'react';
import { Link } from 'react-router-dom';

export class PagePagination extends Component {

    render() {

        let appPath = this.props.appPath;
        let numberOfPages = this.props.numberOfPages;
        let currentPage = this.props.currentPage;

        let leftArrows = Number(currentPage) === 1 ? "disabled" : "";
        let firstPage = leftArrows === "disabled" ? "none" : "block";
        let leftEllipsis = Number(currentPage) >= 5 ? "block" : "none" ;
        let prePrePage = Number(currentPage) >= 4 ? "block" : "none" ;
        let prePage = Number(currentPage) >= 3 ? "block" : "none" ;
        let nextPage = Number(currentPage) + 2 <= Number(numberOfPages) ? "block" : "none" ;
        let nextNextPage = Number(currentPage) + 3 <= Number(numberOfPages) ? "block" : "none" ;
        let rightEllipsis = Number(currentPage) + 4 <= Number(numberOfPages) ? "block" : "none" ;
        let rightArrows = Number(numberOfPages) <= Number(currentPage) ? "disabled" : "";
        let lastPage = rightArrows === "disabled" ? "none" : "block";

        return(
            <ul className="pagination">
                <li className={"page-item " + leftArrows}>
                    <Link className="page-link" to={appPath} role="button" tabIndex="0">
                        «
                    </Link>
                </li>
                <li className={"page-item " + leftArrows}>
                    <Link className="page-link" to={appPath + "&page=" + (Number(currentPage) - 1)} role="button" tabIndex="0">
                        ‹
                    </Link>
                </li>
                <li className="page-item" style={{display: firstPage}}>
                    <Link className="page-link" to={appPath + "&page=" + 1} role="button" tabIndex="0">
                        1
                    </Link>
                </li>
                <li className="page-item disabled">
                    <span className="page-link" disabled style={{display: leftEllipsis}} >
                        <span aria-hidden="true">
                            …
                        </span>
                        <span className="visually-hidden">
                            More
                        </span>
                    </span>
                </li>
                <li className="page-item" style={{display: prePrePage}}>
                    <Link className="page-link" to={appPath + "&page=" + (Number(currentPage) - 2)} role="button" tabIndex="0">
                        {(Number(currentPage) - 2)}
                    </Link>
                </li>
                <li className="page-item" style={{display: prePage}}>
                    <Link className="page-link" to={appPath + "&page=" + (Number(currentPage) - 1)} role="button" tabIndex="0">
                        {(Number(currentPage) - 1)}
                    </Link>
                </li>
                <li className="page-item active">
                    <span className="page-link">
                        {currentPage}
                        <span className="visually-hidden">
                            (current)
                        </span>
                    </span>
                </li>
                <li className="page-item" style={{display: nextPage}}>
                    <Link className="page-link" to={appPath + "&page=" + (Number(currentPage) + 1)} role="button" tabIndex="0">
                        {(Number(currentPage) + 1)}
                    </Link>
                </li>
                <li className="page-item" style={{display: nextNextPage}}>
                <Link className="page-link" to={appPath + "&page=" + (Number(currentPage) + 2)} role="button" tabIndex="0">
                        {(Number(currentPage) + 2)}
                    </Link>
                </li>
                <li className="page-item disabled" style={{display: "block"}}>
                    <span className="page-link" style={{display: rightEllipsis}}>
                        <span aria-hidden="true">
                            …
                        </span>
                        <span className="visually-hidden">
                            More
                        </span>
                </span>
                </li>
                <li className="page-item" style={{display: lastPage}}>
                    <Link className="page-link" to={appPath + "&page=" + numberOfPages} role="button" tabIndex="0">
                        {numberOfPages}
                    </Link>
                </li>

                <li className={"page-item " + rightArrows}>
                    <Link className="page-link" to={appPath + "&page=" + (Number(currentPage) + 1)} role="button" tabIndex="0">
                        <span aria-hidden="true">
                            ›
                        </span>
                        <span className="visually-hidden">
                            Next
                        </span>
                    </Link>
                </li>
                <li className={"page-item " + rightArrows}>
                    <Link className="page-link" to={appPath + "&page=" + numberOfPages} role="button" tabIndex="0">
                        <span aria-hidden="true">
                            »
                        </span>
                        <span className="visually-hidden">
                            Last
                        </span>
                    </Link>
                </li>
            </ul>
        );
    }
}
